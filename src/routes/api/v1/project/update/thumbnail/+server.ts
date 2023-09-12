import { ProjectUpdateThumbnailSchema } from '$ts/common/schema';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to edit a project.' }), {
			status: 401
		});

	// Validate the request body
	const body = await request.json();
	const validation = ProjectUpdateThumbnailSchema.safeParse(body);
	if (!validation.success) {
		return new Response(JSON.stringify({ error: validation.error }), {
			status: 400
		});
	}

	// Get the project
	const project = await locals.prisma.project.findFirst({
		where: {
			id: body.id,
			userId: locals.user.id
		}
	});

	// Check if the project exists
	if (!project)
		return new Response(
			JSON.stringify({ error: 'The project you are trying to edit does not exist.' }),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	await locals.prisma.project.update({
		where: {
			id: body.id
		},
		data: {
			imageUrl: body.imageUrl
		}
	});

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
