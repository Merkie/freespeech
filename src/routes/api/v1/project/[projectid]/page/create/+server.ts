import slugify from '$ts/common/slugify';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ params: { projectid }, locals: { prisma, user }, request }) => {
	const schema = z.object({
		name: z.string().min(1).max(50)
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get the project
	const project = await prisma.project.findUnique({
		where: {
			id: projectid,
			userId: user.id
		},
		include: {
			pages: true
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the page already exists
	if (project.pages.map((page) => slugify(page.name)).includes(slugify(body.name)))
		return json({
			error: 'A page with that name already exists in the project.'
		});

	// Create the page
	const page = await prisma.tilePage.create({
		data: {
			name: body.name,
			Project: {
				connect: {
					id: projectid
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
						color: 'white',
						x: 0,
						y: 0
					}
				]
			}
		}
	});

	return json({ page });
};
