import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const PageCreationSchema = z.object({
	name: z.string().min(1).max(50)
});

export const POST = async ({ request, locals, params }) => {
	const { projectid } = params;

	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to create a page.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});

	const form = await superValidate(await request.json(), PageCreationSchema);

	if (!form.valid)
		return new Response(JSON.stringify({ error: 'Invalid form' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	const fetchedProject = await locals.prisma.project.findFirst({
		where: {
			id: projectid,
			userId: locals.user.id
		}
	});

	if (!fetchedProject)
		return new Response(
			JSON.stringify({
				error:
					'The project you are trying to edit does not exist or you do not have permission to edit it.'
			}),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	const existingPage = await locals.prisma.tilePage.findFirst({
		where: {
			name: form.data.name,
			projectId: projectid
		}
	});
	if (existingPage)
		return new Response(
			JSON.stringify({ error: 'A page with that name already exists in the project.' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	const createdPage = await locals.prisma.tilePage.create({
		data: {
			name: form.data.name,
			Project: {
				connect: {
					id: projectid
				}
			},
			user: {
				connect: {
					id: locals.user.id
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

	return new Response(JSON.stringify({ page: createdPage }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
