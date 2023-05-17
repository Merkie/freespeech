import stringGate from '$ts/common/stringGate.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/login');

	const projects = await locals.prisma.project.findMany({
		where: {
			userId: locals.user.id
		},
		include: {
			pages: true
		}
	});

	const project = projects.find(
		(project) => stringGate(project.name).toLowerCase() === params.project.toLowerCase()
	);

	if (!project) throw redirect(302, '/404');

	const page = project.pages.find(
		(page) => stringGate(page.name).toLowerCase() === params.page.toLowerCase()
	);

	if (!page) throw redirect(302, '/404');

	return { projects, project, page: page.name };
};
