import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';
import type { TilePage, Project, Tile } from '@prisma/client';

export const load: Load = async ({ params, fetch }) => {
	// Logging
	console.log('Beginning page load.');
	const start_time = Date.now();

	// Get the url slug /app/...
	const { slug } = params;

	// Get the project from trpc with the url slug
	//@ts-ignore
	const project: Project & { pages: (TilePage & { tiles: Tile[] })[] } = await trpc(fetch).query(
		'project:fetch',
		slug + ''
	);
	if (!project) return { error: 404 };

	// Sort the tiles based on their tile_index
	project.pages.forEach((page, index) => {
		project.pages[index].tiles = page.tiles.sort((a, b) => a.tile_index - b.tile_index);
	});

	let new_project = { ...project };
	let mutation_requests: Tile[] = [];
	let fetched_tiles: Tile[] = [];

	for await (const page of project.pages) {
		// For each tile in the page
		let index = 0;
		for await (let tile of page.tiles) {
			// If the tile is a link...
			if (tile.link_id) {
				// Fetch the linked tile
				let linked_tile;
				// Try to find the tile in the cache
				if (fetched_tiles.find((t) => t.id === tile.link_id)) {
					linked_tile = fetched_tiles.find((t) => t.id === tile.link_id);
				} else {
					// If it's not in the cache, fetch it
					linked_tile = await trpc(fetch).query('tile:fetch', { id: tile.link_id });
					if (!linked_tile) continue;
					// push it to the cache
					fetched_tiles.push(linked_tile);
				}

				// Replace the tile with the linked tile
				const corrected_tile: Tile = {
					...tile,
					...linked_tile,
					id: tile.id,
					tap_count: tile.tap_count,
					userId: tile.userId,
					tilePageId: tile.tilePageId,
					tile_index: tile.tile_index,
					link_id: linked_tile?.id + ''
				};

				// Set the tile to the corrected tile
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				] = corrected_tile;

				// push to mutation request if link needs to be updated
				if (tile !== corrected_tile) {
					mutation_requests.push(corrected_tile);
				}
			}

			// If the tile's index is not the same as the index in the array
			if (tile.tile_index != index) {
				const page_index = new_project.pages.findIndex((p) => p.id === page.id);
				const tile_index = new_project.pages[page_index].tiles.findIndex((t) => t.id === tile.id);

				// Upadte the tile's index
				new_project.pages[page_index].tiles[tile_index].tile_index = index;
				// push to trpc
				mutation_requests.push({ ...tile, tile_index: index });
			}
			index++;
		}
	}

	// remove duplicates from mutation requests
	mutation_requests = mutation_requests
		.reverse()
		.filter((tile, index, self) => index === self.findIndex((t) => t.id === tile.id));
	//@ts-ignore
	await trpc(fetch).mutation('tile:edit_many', mutation_requests);

	const end_time = Date.now();
	let timeDiffInSeconds = Math.floor((end_time - start_time) / 1000);
	console.log('Load time: ', timeDiffInSeconds + 's', Date.now());
	return new_project;
};
