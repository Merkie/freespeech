export const POST = async ({ params, locals, request }) => {
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to update a page.' }), {
			status: 401
		});

	const { pagename, projectid } = params;
	const { data } = await request.json();

	const fetchedProject = await locals.prisma.project.findFirst({
		where: {
			id: projectid,
			userId: locals.user.id
		},
		include: {
			pages: true
		}
	});

	if (!fetchedProject)
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404
		});

	const fetchedPage = await locals.prisma.tilePage.findFirst({
		where: {
			name: pagename,
			projectId: projectid
		}
	});

	if (!fetchedPage)
		return new Response(JSON.stringify({ error: 'Page not found.' }), {
			status: 404
		});

	await locals.prisma.tilePage.update({
		where: {
			id: fetchedPage.id
		},
		data
	});

	const refreshedPage = await locals.prisma.tilePage.findFirst({
		where: {
			name: pagename,
			projectId: projectid
		}
	});

	return new Response(JSON.stringify({ success: true, page: refreshedPage }), {
		status: 200
	});
};
