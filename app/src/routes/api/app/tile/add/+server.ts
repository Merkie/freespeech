import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { page_id: number } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

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

	if (!page) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

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
