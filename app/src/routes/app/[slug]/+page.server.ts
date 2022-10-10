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

	const new_project = await project.pages.map(async (page) => await page);

	for await (const page of project.pages){
		// console.log(page);
		for await (let tile of page.tiles){
			if (tile.link_id) {
			console.log(page)
				const new_tile = await trpc(fetch).query('tile:fetch', { id: tile.link_id });
				delete new_tile.id;
				delete new_tile.tap_count;
				delete new_tile.userId;
				delete new_tile.tilePageId;
				tile = {
					...tile,
					...new_tile
				}

				console.log("Race 1st");
			}
		}
	}

	console.log("Race 2nd");
	// wait 3 seconds
	// await new Promise((resolve) => setTimeout(resolve, 500));

	// console.log(new_project.pages[23]?.tiles[0]);

	// cycle through each page and every tile in the page, if the tile has a like_id, then update it

	// project.pages = await project.pages.map(async (page, pindex) => page);

	// {
	// 	return page;
	// 	// new_page.tiles =
	// 	// 	[] ||
	// 	// 	(await page.tiles.map(async (tile, tindex) => {
	// 	// 		if (tile.link_id) {
	// 	// 			let new_tile = await trpc(fetch).query('tile:fetch', { id: tile.link_id });
	// 	// 			if (!new_tile) return;
	// 	// 			delete new_tile.id;
	// 	// 			delete new_tile.tap_count;
	// 	// 			delete new_tile.userId;
	// 	// 			delete new_tile.tilePageId;
	// 	// 			console.log({ ...tile, ...new_tile });
	// 	// 			return { ...tile, ...new_tile };
	// 	// 		}
	// 	// 		return tile;
	// 	// 	}));
	// 	// return new_page;
	// }
	return project;
};
