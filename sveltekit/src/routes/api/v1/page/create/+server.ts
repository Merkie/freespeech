import slugify from '$ts/common/slugify';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ locals: { prisma, user }, request }) => {
	const schema = z.object({
		name: z.string().min(1).max(50),
		projectId: z.string()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get the project
	const project = await prisma.project.findUnique({
		where: {
			id: body.projectId,
			userId: user.id
		},
		include: {
			connectedPages: {
				include: {
					tilePage: true
				}
			}
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the page already exists
	if (
		project.connectedPages
			.map(({ tilePage }) => slugify(tilePage.name))
			.includes(slugify(body.name))
	)
		return json({
			error: 'A page with that name already exists in the project.'
		});

	// Create the page
	const page = await prisma.tilePage.create({
		data: {
			name: body.name,
			user: {
				connect: {
					id: user.id
				}
			},
			connectedProjects: {
				create: {
					projectId: project.id
				}
			},
			tiles: {
				create: {
					page: 0,
					x: 0,
					y: 0
				}
			}
		}
	});

	return json({ page });
};
