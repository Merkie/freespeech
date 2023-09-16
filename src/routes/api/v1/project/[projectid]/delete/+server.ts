import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectid }, locals: { user, prisma } }) => {
	const project = await prisma.project.findUnique({
		where: {
			id: projectid,
			userId: user.id
		}
	});

	if (!project)
		return json({
			error: 'Project not found.'
		});

	await prisma.project.delete({
		where: {
			id: projectid
		}
	});

	return json({
		message: 'Project deleted successfully.'
	});
};
