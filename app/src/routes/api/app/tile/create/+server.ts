import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';
import type { Tile } from '@prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: {
		page_id: string;
		tile: Tile;
	} = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const page = await client.tilePage.findFirst({
		where: {
			id: parseInt(body.page_id + ''),
			user_id: session.user.user_id
		},
		include: {
			tiles: true
		}
	});

	if (!page) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const new_tile: Tile = await client.tile.create({
		data: {
			display: Math.random().toString().split('.')[1].substring(0, 4),
			index: body.tile.index,
			user: {
				connect: {
					id: session.user.user_id
				}
			}
		}
	});

	console.log(new_tile);

	await client.tilePage.update({
		where: {
			id: page.id
		},
		data: {
			tiles: {
				connect: {
					id: new_tile.id
				}
			}
		}
	});

	return new Response(JSON.stringify({ message: 'success', tile: new_tile }), { status: 200 });
};
