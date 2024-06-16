import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectId }, locals: { user, prisma }, url }) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId || url.pathname.split('project/')[1].split('/delete')[0],
			userId: user.id
		},
		include: {
			connectedPages: {
				where: {
					tilePage: {
						userId: user.id
					}
				},
				include: {
					tilePage: true
				}
			}
		}
	});

	if (!project) {
		return json({
			success: false,
			error: 'Project not found'
		});
	}

	const pageIds = project.connectedPages.map(({ tilePage }) => tilePage.id);

	await prisma.tilePage.deleteMany({
		where: {
			id: {
				in: pageIds
			}
		}
	});

	await prisma.project.delete({
		where: {
			id: projectId
		}
	});

	return json({
		success: true
	});
};
