import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	// get all user projects, sort by most recent
	const projects = await locals.prisma.project.findMany({
		where: {
			userId: locals.user.id
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { projects };
};
