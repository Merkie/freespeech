import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';

export const load: Load = async ({ params, fetch }) => {
	// 1) Get slug
	const { slug } = params;
	// 2) Get the project from trpc
	const project = await trpc(fetch).query('project:fetch', slug + '');
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
				if (!new_tile) return;
				delete new_tile.id;
				delete new_tile.tap_count;
				delete new_tile.userId;
				delete new_tile.tilePageId;
				delete new_tile.tile_index;
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				] = { ...tile, ...new_tile, tile_index: index };
			}
			// temp: force sensable tile order
			try {
				new_project.pages[new_project.pages.indexOf(page)].tiles[
					new_project.pages[new_project.pages.indexOf(page)].tiles.indexOf(tile)
				].tile_index = index;
				index++;
			} catch (e) {}
		}
	}

	return new_project;
};
