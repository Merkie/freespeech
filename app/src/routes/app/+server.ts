import trpc from '$lib/client/trpc';
import type { Project, User } from '@prisma/client';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params }) => {
	const user = await trpc(fetch).query('user:me_whole');
	if (!user) throw redirect(302, '/portal');

	// sort by most recent
	let user_projects = user?.projects.sort((a, b) => {
		return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
	});

	throw redirect(302, '/app/' + user_projects[0].id);
};
