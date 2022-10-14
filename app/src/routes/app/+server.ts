import trpc from '$lib/client/trpc';
import type { Project, User } from '@prisma/client';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params }) => {
	// Get whole user object from server
	try {
		const user = await trpc(fetch).query('user:me_whole');
		// Return a redirect to the first project in the user's list
		throw redirect(302, '/app/' + user?.projects[0].id);
	} catch (e) {
		throw redirect(302, '/portal');
	}
};
