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

	for await (const page of project.pages) {
		// For each tile in the page
		let index = 0;
		for await (let tile of page.tiles) {
			// If the tile's index is not the same as the index in the array
			if (tile.tile_index != index) {
				// Upadte the tile's index
				tile.tile_index = index;
				// push to trpc
				mutation_requests.push({ ...tile, tile_index: index });
			}
			index++;
		}
	}

	let linked_tiles: Tile[] = [];
	let fetch_requests: string[] = [];

	for (const page of new_project.pages) {
		for (const tile of page.tiles) {
			if (tile.link_id) {
				linked_tiles.push(tile);
				if (!fetch_requests.includes(tile.link_id)) fetch_requests.push(tile.link_id);
			}
		}
	}

	console.log(`Fetching ${fetch_requests.length} linked tiles...`);

	//@ts-ignore
	const response_tiles: Tile[] = await trpc(fetch).query('tile:fetch_many', fetch_requests);

	// update all the tiles
	for (const tile of linked_tiles) {
		const response_tile = response_tiles.find((t) => t.id === tile.link_id);
		if (response_tile) {
			// get the page and tile index so we can update it in the new project
			const page_index = new_project.pages.findIndex((p) => p.id === tile.tilePageId);
			const tile_index = new_project.pages[page_index].tiles.findIndex((t) => t.id === tile.id);
			// update the tile
			new_project.pages[page_index].tiles[tile_index] = {
				...response_tile,
				tile_index: tile.tile_index,
				tilePageId: tile.tilePageId,
				link_id: response_tile.id,
				id: tile.id
			};
		}
	}

	// remove duplicates from mutation requests
	mutation_requests = mutation_requests
		.reverse()
		.filter((tile, index, self) => index === self.findIndex((t) => t.id === tile.id));
	console.log(`mutating ${mutation_requests.length} tiles`);

	//@ts-ignore
	await trpc(fetch).mutation('tile:edit_many', mutation_requests);

	const end_time = Date.now();
	let timeDiffInSeconds = Math.floor((end_time - start_time) / 1000);
	console.log('Load time: ', timeDiffInSeconds + 's', Date.now());

	// Fetch voices
	const voices = await trpc(fetch).query('tts:azure_voices');

	return { ...new_project, voices };
};
