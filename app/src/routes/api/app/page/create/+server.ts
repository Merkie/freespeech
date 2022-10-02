import { client } from '$lib/resources';
import { auth } from '$lib/resources';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { project_id: string; name: string } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const project = await client.project.findFirst({
		where: {
			id: body.project_id,
			userId: session.user.user_id
		}
	});

	if (!project) {
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
			name: body.name,
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

	await client.project.update({
		where: {
			id: body.project_id
		},
		data: {
			pages: {
				connect: {
					id: page.id
				}
			}
		}
	});

	let finalPage = await client.tilePage.findFirst({
		where: {
			id: page.id
		},
		include: {
			tiles: true
		}
	});

	// TODO: Return the user's project
	return new Response(JSON.stringify({ message: 'ok', page: finalPage }), { status: 200 });
};
