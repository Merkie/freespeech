import slugify from '$ts/common/slugify';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({
	params: { projectid, pageid },
	locals: { user, prisma },
	request
}) => {
	const schema = z.object({
		name: z.string().min(3).max(50).optional(),
		data: z.any().optional()
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

	// Check if the page exists
	if (body.name)
		if (
			project.pages
				.filter((page) => page.id !== pageid)
				.map((page) => slugify(page.name))
				.includes(slugify(body.name))
		)
			return json({
				error: 'A page with that name already exists in the project.'
			});

	const requestedPage = project.pages.find((page) => page.id === pageid);

	if (!requestedPage) return json({ error: 'The page you are trying to edit does not exist.' });

	await prisma.tilePage.update({
		where: {
			id: requestedPage.id
		},
		data: {
			data: body.data || requestedPage.data,
			name: body.name || requestedPage.name
		}
	});

	return json({ success: true });
};
