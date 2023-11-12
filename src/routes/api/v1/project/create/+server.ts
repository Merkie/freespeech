import { json } from '@sveltejs/kit';
import { z } from 'zod';
import slugify from '$ts/common/slugify';

export const POST = async ({ request, locals: { user, prisma } }) => {
	const schema = z.object({
		name: z.string(),
		columns: z.number(),
		rows: z.number()
	});

	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get all user projects
	const projects = await prisma.project.findMany({
		where: {
			userId: user.id
		}
	});

	// Check if the project name is already taken
	if (projects.map((project) => slugify(project.name)).includes(slugify(body.name)))
		return json({
			error: 'A project with that name already exists.'
		});

	// Create the project
	const project = await prisma.project.create({
		data: {
			name: body.name,
			description: '',
			isPublic: false,
			columns: body.columns,
			rows: body.rows,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	// Create the home page
	await prisma.tilePage.create({
		data: {
			name: 'Home',
			Project: {
				connect: {
					id: project.id
				}
			},
			user: {
				connect: {
					id: user.id
				}
			},
			data: {
				tiles: [
					{
						page: 0,
						text: 'New tile',
						x: 0,
						y: 0
					}
				]
			}
		}
	});

	return json({
		success: true
	});
};
