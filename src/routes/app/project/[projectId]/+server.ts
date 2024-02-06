import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals: { prisma, user }, params: { projectId } }) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			userId: user.id
		},
		include: {
			pages: true
		}
	});

	if (!project) throw redirect(302, '/app/dashboard');

	const homePage = project.pages.find((page) => page.name.toLowerCase().trim() === 'home');
	if (!homePage) throw redirect(302, `/app/project/${projectId}/${project.pages[0].id}`);

	throw redirect(302, `/app/project/${projectId}/${homePage.id}`);
};
