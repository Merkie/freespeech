export const POST = async ({ params, locals, request }) => {
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to update a project.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});

	const { projectid } = params;
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
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	await locals.prisma.project.update({
		where: {
			id: fetchedProject.id
		},
		data: {
			name: data.name || fetchedProject.name,
			description: data.description || fetchedProject.description,
			isPublic: data.isPublic || fetchedProject.isPublic,
			imageUrl: data.imageUrl || fetchedProject.imageUrl,
			columns: data.columns || fetchedProject.columns,
			rows: data.rows || fetchedProject.rows
		}
	});

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
