import { json } from '@sveltejs/kit';

export const GET = async ({ params: { projectid }, locals: { prisma, user } }) => {
	const project = await prisma.project.findUnique({
		where: {
			id: projectid
		},
		include: {
			pages: true
		}
	});

	if (!project)
		return json({
			error: 'Project not found.'
		});

	if (project.userId === user?.id || project.isPublic) {
		return json({ project });
	}

	return json({
		error: 'You do not have permission to view this project.'
	});
};
