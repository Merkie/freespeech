import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';
import type { Tile } from '@prisma/client';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { updates: Array<Tile> } = await request.json();

	console.log(body.updates);

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	body.updates.forEach(async (tile) => {
		if (!tile) return;
		const tile_id = tile.id;
		// @ts-ignore
		delete tile.id;

		const fetchedTile = await client.tile.findFirst({
			where: {
				id: tile_id,
				user_id: session.user.user_id
			}
		});
		if (!fetchedTile) return;
		try {
			console.log('success');
			console.log(tile, tile_id);
			await client.tile.update({
				where: {
					id: tile_id
				},
				data: {
					index: tile_id
				}
			});
		} catch (e) {
			console.log('error');
			console.log(tile, tile_id);
			console.log(e);
		}
	});

	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
