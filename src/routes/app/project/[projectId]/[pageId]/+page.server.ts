import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { prisma, user }, params: { projectId, pageId } }) => {
	const projectPage = await prisma.tilePageInProject.findFirst({
		where: {
			project: {
				userId: user.id,
				id: projectId
			},
			tilePageId: pageId
		},
		include: {
			tilePage: {
				include: {
					tiles: true
				}
			},
			project: {
				include: {
					connectedPages: {
						include: {
							tilePage: true
						},
						orderBy: {
							tilePage: {
								updatedAt: 'desc'
							}
						}
					}
				}
			}
		}
	});

	if (!projectPage || !projectPage.tilePage || !projectPage.project)
		throw redirect(302, '/app/dashboard/projects');

	return {
		page: projectPage.tilePage,
		project: projectPage.project,
		projectPages: projectPage.project.connectedPages.map((p) => p.tilePage)
	};
};
