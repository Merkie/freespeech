import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';
import type { Tile } from '@prisma/client';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { updates: Array<Tile> } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	body.updates.forEach(async (tile) => {
		if (!tile) return;

		// check and make sure the user owns the tile
		const fetchedTile = await client.tile.findFirst({
			where: {
				id: tile.id,
				user_id: session.user.user_id
			}
		});

		// if the tile doesn't exist, or the user doesn't own it, return
		if (!fetchedTile) return;

		// update the tile
		await client.tile.update({
			where: {
				id: tile.id
			},
			data: {
				...tile // the tile object is destructured here
			}
		});
	});

	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
