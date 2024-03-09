import { redirect } from '@sveltejs/kit';
import { ELEVEN_LABS_ENDPOINT } from '$env/static/private';

export const load = async ({ locals, params: { projectId } }) => {
	if (!locals.user) throw redirect(302, '/login');

	return {
		projectId,
		ELEVEN_LABS_ENDPOINT
	};
};
