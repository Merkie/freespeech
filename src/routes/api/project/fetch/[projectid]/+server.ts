import prisma from '$ts/server/prisma';

export const GET = async ({ params, locals }) => {
	const { projectid } = params;

	const project = await prisma.project.findUnique({
		where: {
			id: projectid
		},
		include: {
			pages: true
		}
	});

	if (!project)
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});

	if (project.userId === locals.user?.id || project.isPublic) {
		return new Response(JSON.stringify({ project }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(
		JSON.stringify({ error: 'You do not have permission to view this project.' }),
		{
			status: 403,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
