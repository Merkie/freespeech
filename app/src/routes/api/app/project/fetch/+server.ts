import { client } from '$lib/prisma';
import { auth } from '$lib/lucia';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { project_id: string } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const project = await client.project.findFirst({
		where: {
			id: body.project_id,
			userId: session.user.user_id
		},
		include: {
			pages: {
				include: {
					tiles: true
				}
			}
		}
	});

	if (!project) return new Response(JSON.stringify({ message: 'error' }), { status: 200 });

	// TODO: Return the user's project
	return new Response(JSON.stringify({ message: 'success', project }), { status: 200 });
};
