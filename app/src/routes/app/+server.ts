import trpc from '$lib/client/trpc';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params }) => {
	// Get whole user object from server
	const user = await trpc(fetch).query('user:me_whole');
	if (!user) throw redirect(302, '/portal');
	// Return a redirect to the first project in the user's list
	throw redirect(302, '/app/' + user?.projects[0].id);
};
