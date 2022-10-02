import { client } from '$lib/resources';
import { auth } from '$lib/resources';

import type { RequestHandler } from '@sveltejs/kit';
import type { Project } from '@prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { project_id: string; updates: Project } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	const project = await client.project.findFirst({
		where: {
			id: body.project_id,
			userId: session.user.user_id
		}
	});

	if (!project) return new Response(JSON.stringify({ message: 'error' }), { status: 200 });

	await client.project.update({
		where: {
			id: body.project_id
		},
		data: {
			...body.updates
		}
	});
	// TODO: Return the user's project
	return new Response(JSON.stringify({ message: 'success' }), { status: 200 });
};
