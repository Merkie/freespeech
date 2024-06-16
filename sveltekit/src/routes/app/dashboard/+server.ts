import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	throw redirect(302, '/app/dashboard/projects');
};
