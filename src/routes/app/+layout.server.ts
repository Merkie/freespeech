import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params: { projectId }, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	return {
		projectId,
		noUI: url.pathname.endsWith('/thumbnail')
	};
};
