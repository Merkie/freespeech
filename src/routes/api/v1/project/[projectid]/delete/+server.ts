import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectId }, locals: { user, prisma } }) => {
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
