export const DELETE = async ({ params, locals }) => {
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to delete a page.' }), {
			status: 401
		});

	const { pagename, projectid } = params;

	const fetchedProject = await locals.prisma.project.findFirst({
		where: {
			id: projectid,
			userId: locals.user?.id
		},
		include: {
			pages: true
		}
	});

	if (!fetchedProject)
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404
		});

	if (project.userId !== locals.user?.id)
		return new Response(
			JSON.stringify({ error: 'You do not have permission to edit this project.' }),
			{
				status: 403
			}
		);

	const page = await locals.prisma.tilePage.findFirst({
		where: {
			name: pagename,
			projectId: projectid
		}
	});

	if (!page)
		return new Response(JSON.stringify({ error: 'Page not found.' }), {
			status: 404
		});

	await locals.prisma.tilePage.delete({
		where: {
			id: page.id
		}
	});

	return new Response(JSON.stringify({ success: true }), {
		status: 200
	});
};
