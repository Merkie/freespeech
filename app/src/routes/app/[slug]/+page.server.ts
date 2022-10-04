// @ts-nocheck
import { client } from '$lib/resources';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, params }) => {
	const auth = await parent(); // Get the auth data from the parent route
	if (!auth['_lucia']) throw redirect(302, '/'); // If the user is not logged in, redirect to the home page

	// Chain get to get the entire project
	// TODO: Cache this in the browser
	var project = await client.project.findFirst({
		where: {
			id: params.slug + '', // TODO: Change this to have a slug,
			userId: auth['_lucia'].user.user_id
		},
		include: {
			user: true,
			pages: {
				include: {
					tiles: true
				}
			}
		}
	});

	// if no projects, redirecrt back to dashboard
	if (!project) {
		throw redirect(302, '/dashboard');
	}

	const edit_tile = (page_index, tile_index, tile, link) => {
		project.pages[page_index].tiles[tile_index] = { ...tile, ...link };
		project = { ...project };
	};

	project.pages.forEach((page) => {
		page.tiles.forEach(async (tile) => {
			if (tile.link) {
				const link = await client.tile.findFirst({
					where: {
						id: tile.link
					}
				});
				if (!link) return;
				if (link?.user_id === auth['_lucia'].user.user_id || link?.public) {
					delete link.link;
					delete link.id;
					delete link.index;
					delete link.tilePageId;
					delete link.user_id;

					let page_index = -1;
					project.pages.forEach((_page, _index) => {
						if (_page.id == tile.tilePageId) {
							page_index = _index;
						}
					});
					if (page_index < 0) return;
					let tile_index = -1;
					project.pages[page_index]?.tiles.forEach((_tile, _index) => {
						if (_tile.id == tile.id) {
							tile_index = _index;
						}
					});
					edit_tile(page_index, tile_index, tile, link);
				}
			}
		});
	});

	// TODO: can this be better? needs to be here to take time to update the project
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { project };
};
