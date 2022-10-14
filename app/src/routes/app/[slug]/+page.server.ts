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
		let index = 0;
		for await (let tile of page.tiles) {
			if (tile.link_id) {
				const new_tile: any = await trpc(fetch).query('tile:fetch', { id: tile.link_id });
				let new_tile_id = new_tile.id;
				if (!new_tile) return;
				delete new_tile.id;
				delete new_tile.tap_count;
				delete new_tile.userId;
				delete new_tile.tilePageId;
				delete new_tile.tile_index;

				const corrected_tile: Tile = {
					//@ts-ignore
					...tile,
					...new_tile,
					tile_index: index,
					link_id: new_tile_id
				};

				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				] = corrected_tile;

				// update with trpc
				if (tile !== corrected_tile) {
					await trpc(fetch).mutation('tile:edit', {
						...tile,
						...new_tile,
						tile_index: index,
						link_id: new_tile_id,
						id: tile.id
					});
				}
			}
			// temp: force sensable tile order
			try {
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				].tile_index = index;
				if (tile.tile_index != index) {
					await trpc(fetch).mutation('tile:edit', {
						...tile,
						tile_index: index,
						id: tile.id
					});
				}
				index++;
			} catch (e) {}
		}
	}

	const end_time = Date.now();
	let timeDiffInSeconds = Math.floor((end_time - start_time) / 1000);
	console.log('Load time: ', timeDiffInSeconds + 's', Date.now());
	return new_project;
};
