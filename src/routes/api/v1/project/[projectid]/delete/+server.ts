import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectId }, locals: { user, prisma }, url }) => {
	await prisma.project.delete({
		where: {
			id: projectId || url.pathname.split('project/')[1].split('/delete')[0],
			userId: user.id
		}
	});

	return json({
		success: true
	});
};
