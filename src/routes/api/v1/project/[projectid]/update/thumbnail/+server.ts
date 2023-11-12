import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ params: { projectid }, request, locals: { user, prisma } }) => {
	const schema = z.object({
		imageUrl: z.string().min(1)
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get the project
	const project = await prisma.project.findFirst({
		where: {
			id: projectid,
			userId: user.id
		}
	});

	// Check if the project exists
	if (!project)
		return json({
			error: 'The project you are trying to edit does not exist.'
		});

	await prisma.project.update({
		where: {
			id: projectid
		},
		data: {
			imageUrl: body.imageUrl
		}
	});

	return json({
		success: true
	});
};
