import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';
import type { TilePage, Project, Tile } from '@prisma/client';

export const load: Load = async ({ params, fetch }) => {
	const start_time = Date.now();
	// 1) Get slug
	const { slug } = params;

	// 2) Get the project from trpc
	//@ts-ignore
	const project: Project & { pages: (TilePage & { tiles: Tile[] })[] } = await trpc(fetch).query(
		'project:fetch',
		slug + ''
	);
	if (!project) return { error: 404 };

	// 3) Sort the tiles by their tile_index property
	project.pages.forEach((page, index) => {
		project.pages[index].tiles = page.tiles.sort((a, b) => a.tile_index - b.tile_index);
	});

	let new_project = { ...project };

	for await (const page of project.pages) {
		// For each tile in the page
		let index = 0;
		for await (let tile of page.tiles) {
			// If the tile is a link...
			if (tile.link_id) {
				// Fetch the linked tile
				const linked_tile: any = await trpc(fetch).query('tile:fetch', { id: tile.link_id });
				if (!linked_tile) return;

				// Replace the tile with the linked tile
				const corrected_tile: Tile = {
					...tile,
					...linked_tile,
					id: tile.id,
					tap_count: tile.tap_count,
					userId: tile.userId,
					tilePageId: tile.tilePageId,
					tile_index: tile.tile_index,
					link_id: linked_tile.id
				};

				// Set the tile to the corrected tile
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				] = corrected_tile;

				// update with trpc
				if (tile !== corrected_tile) {
					//@ts-ignore
					await trpc(fetch).mutation('tile:edit', corrected_tile);
				}
			}

			// If the tile's index is not the same as the index in the array
			if (tile.tile_index != index) {
				// Upadte the tile's index
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				].tile_index = index;
				//@ts-ignore
				await trpc(fetch).mutation('tile:edit', { ...tile, tile_index: index });
			}

			index++;
		}
	}

	const end_time = Date.now();
	let timeDiffInSeconds = Math.floor((end_time - start_time) / 1000);
	console.log('Load time: ', timeDiffInSeconds + 's', Date.now());
	return new_project;
};
