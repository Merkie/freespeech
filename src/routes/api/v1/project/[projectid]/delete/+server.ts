import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectId }, locals: { user, prisma }, url }) => {
	console.log(url.pathname, url.pathname.split('project/')[1].split('/delete')[0]);
	await prisma.project.delete({
		where: {
			id: projectId,
			userId: user.id
		}
	});

	return json({
		success: true
	});
};
