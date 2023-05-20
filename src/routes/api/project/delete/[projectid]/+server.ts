export const DELETE = async ({ params, locals }) => {
	const { projectid } = params;

	const project = await locals.prisma.project.findUnique({
		where: {
			id: projectid
		}
	});

	if (!project) {
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404
		});
	}

	if (project.userId === locals.user?.id) {
		await locals.prisma.project.delete({
			where: {
				id: projectid
			}
		});

		return new Response(JSON.stringify({ message: 'Project deleted successfully.' }), {
			status: 200
		});
	}

	return new Response(
		JSON.stringify({ error: 'You do not have permission to delete this project.' }),
		{
			status: 403
		}
	);
};
