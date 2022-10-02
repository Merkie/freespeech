import { client } from '$lib/resources';
import { auth } from '$lib/resources';

import type { RequestHandler } from '@sveltejs/kit';
import type { Tile } from '@prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: {
		tile: Tile;
	} = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Get the tile with the user's id
	const tile = await client.tile.findFirst({
		where: {
			id: parseInt(body.tile.id + ''),
			user_id: session.user.user_id
		}
	});

	// If the tile doesn't exist, return an error
	if (!tile) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	//@ts-ignore
	delete body.tile.id;

	// Update the tile
	await client.tile.update({
		where: {
			id: tile.id
		},
		data: {
			...body.tile
		}
	});

	// Return a success message
	return new Response(JSON.stringify({ message: 'success' }), { status: 200 });
};
