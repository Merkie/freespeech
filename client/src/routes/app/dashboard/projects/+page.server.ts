import api from '$ts/client/api/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, cookies }) => {
	if (!locals.user) throw redirect(302, '/login');

	const { projects } = await api.project.list(cookies.get('token'));

	return { projects };
};
