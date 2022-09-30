import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { name: string; description: string } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const tile = await client.tile.create({
		data: {
			display: 'An unnamed tile',
			index: 0,
			user: {
				connect: {
					id: session.user.user_id
				}
			}
		}
	});

	const page = await client.tilePage.create({
		data: {
			name: 'Home',
			tiles: {
				connect: {
					id: tile.id
				}
			},
			user: {
				connect: {
					id: session.user.user_id
				}
			}
		}
	});

	const project = await client.project.create({
		data: {
			name: body.name,
			description: body.description,
			user: {
				connect: {
					id: session.user.user_id
				}
			},
			index: page.id,
			pages: {
				connect: {
					id: page.id
				}
			}
		}
	});

	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
