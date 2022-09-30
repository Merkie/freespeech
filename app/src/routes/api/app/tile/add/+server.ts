import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { page_id: number } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Get the page including the tiles
	const page = await client.tilePage.findFirst({
		where: {
			id: body.page_id,
			user: {
				id: session.user.user_id
			}
		},
		include: {
			tiles: true
		}
	});

	// If the page doesn't exist, or the user doesn't own it, return
	if (!page) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Create a new tile
	const tile = await client.tile.create({
		data: {
			display: 'An unnamed tile ' + page.tiles.length,
			index: page.tiles.length,
			user: {
				connect: {
					id: session.user.user_id
				}
			}
		}
	});

	// Add the tile to the page
	await client.tilePage.update({
		where: {
			id: page.id
		},
		data: {
			tiles: {
				connect: {
					id: tile.id
				}
			}
		}
	});

	return new Response(JSON.stringify({ message: 'ok', tile }), { status: 200 });
};
