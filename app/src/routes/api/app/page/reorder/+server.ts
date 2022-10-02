import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';
import type { Tile } from '@prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { page_id: string; new_items: Tile[] } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Get the page with the user's id
	const page = await client.tilePage.findFirst({
		where: {
			id: parseInt(body.page_id + ''),
			user_id: session.user.user_id
		},
		include: {
			tiles: true
		}
	});

	// If the page doesn't exist, return an error
	if (!page) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Update the tiles
	body.new_items.forEach(async (item: Tile) => {
		if (!item) return;

		// Find the tile in the database
		const new_tile = await client.tile.findFirst({
			where: {
				id: parseInt(item.id + ''),
				tilePageId: parseInt(body.page_id + ''),
				user_id: session.user.user_id
			}
		});

		// If the tile doesn't exist, return an error
		if (!new_tile) return;

		// Update the tile
		await client.tile.update({
			where: {
				id: new_tile.id
			},
			data: {
				index: item.index
			}
		});
	});

	// Return a success message
	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
