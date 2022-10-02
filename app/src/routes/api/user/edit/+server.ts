import { auth } from '$lib/lucia';
import { setCookie } from 'lucia-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = await auth.validateRequest(request);
	const body: { user: User } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Update the user
	await client.user.update({
		where: {
			id: session.user.user_id
		},
		data: {
			...body.user
		}
	});

	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
