import { client } from '$lib/resources';
import { auth } from '$lib/resources';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { name: string; description: string } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Create a new tile
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

	// Create a new page with the tile in it
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

	// Create a new project with the page in it
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

	// TODO: Return the user's project
	return new Response(JSON.stringify({ message: 'ok', project }), { status: 200 });
};
