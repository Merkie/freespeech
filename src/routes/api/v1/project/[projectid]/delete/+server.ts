import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { projectid }, locals }) => {
	const project = await locals.prisma.project.findUnique({
		where: {
			id: projectid
		}
	});

	if (!project) {
		return json({
			error: 'Project not found.'
		});
	}

	if (project.userId === locals.user?.id) {
		await locals.prisma.project.delete({
			where: {
				id: projectid
			}
		});

		return json({
			message: 'Project deleted successfully.'
		});
	}

	return json({
		error: 'You do not have permission to delete this project.'
	});
};
