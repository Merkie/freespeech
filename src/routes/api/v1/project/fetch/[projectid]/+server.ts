import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals }) => {
	const { projectid } = params;

	const project = await locals.prisma.project.findUnique({
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

	if (project.userId === locals.user?.id || project.isPublic) {
		return json({ project });
	}

	return json({
		error: 'You do not have permission to view this project.'
	});
};
