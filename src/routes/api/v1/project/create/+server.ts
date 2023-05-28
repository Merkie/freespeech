import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const ProjectCreationSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().min(1).max(500).default(''),
	isPublic: z.boolean().default(false),
	columns: z.number().default(6),
	rows: z.number().default(4)
});

export const POST = async ({ request, locals }) => {
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to create a project.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});

	const form = await superValidate(await request.json(), ProjectCreationSchema);

	if (!form.valid)
		return new Response(JSON.stringify({ error: 'Invalid form' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	const createdProject = await locals.prisma.project.create({
		data: {
			name: form.data.name,
			description: form.data.description,
			isPublic: form.data.isPublic,
			columns: form.data.columns,
			rows: form.data.rows,
			userId: locals.user.id
		}
	});

	return new Response(JSON.stringify({ project: createdProject }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
