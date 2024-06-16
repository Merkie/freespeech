import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params: { projectId } }) => {
	if (!locals.user) throw redirect(302, '/login');

	return {
		projectId
	};
};
