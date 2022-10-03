import { client } from '$lib/resources';
import { auth } from '$lib/resources';

import type { RequestHandler } from '@sveltejs/kit';
import type { TilePage } from '@prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.validateRequest(request);
	const body: { page_id: number } = await request.json();

	if (!session.user) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Get the page with the user's id
	const page = await client.tilePage.findFirst({
		where: {
			id: body.page_id,
			user_id: session.user.user_id
		}
	});

	// If the page doesn't exist, return an error
	if (!page) {
		console.log('page not found');
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	// Update the page
	await client.tilePage.delete({
		where: {
			id: page.id
		}
	});
	console.log('page deleted');

	// Return a success message
	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
