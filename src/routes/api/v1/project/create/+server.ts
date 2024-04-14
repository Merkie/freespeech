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
	const createdProject = await prisma.project.create({
		data: {
			name: body.name,
			description: '',
			isPublic: false,
			columns: body.columns,
			rows: body.rows,
			userId: user.id
		}
	});

	// Create the home page
	const createdHomePage = await prisma.tilePage.create({
		data: {
			name: 'Home',
			userId: user.id,
			connectedProjects: {
				create: {
					projectId: createdProject.id
				}
			}
		}
	});

	// Create a tile for the home page
	await prisma.tile.create({
		data: {
			tilePageId: createdHomePage.id,
			page: 0,
			x: 0,
			y: 0
		}
	});

	return json({
		success: true
	});
};
