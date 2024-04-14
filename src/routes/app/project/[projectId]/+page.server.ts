import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { prisma, user }, params: { projectId } }) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			userId: user.id
		},
		include: {
			connectedPages: {
				include: {
					tilePage: true
				}
			}
		}
	});

	if (!project) throw redirect(307, '/app/dashboard');

	const homePage = project.connectedPages.find(
		({ tilePage }) => tilePage.name.toLowerCase().trim() === 'home'
	);
	if (!homePage)
		throw redirect(307, `/app/project/${projectId}/${project.connectedPages[0].tilePageId}`);

	throw redirect(307, `/app/project/${projectId}/${homePage.id}`);
};
