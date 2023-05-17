import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { redirect } from '@sveltejs/kit';

const CreateNewProjectSchema = z.object({
	name: z.string().min(1),
	columns: z.number().default(6).optional(),
	rows: z.number().default(4).optional(),
	description: z.string().optional(),
	isPublic: z.boolean().optional()
});

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	// get all user projects, sort by most recent
	const projects = await locals.prisma.project.findMany({
		where: {
			userId: locals.user.id
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const createProjectForm = await superValidate(CreateNewProjectSchema, {
		id: 'createForm'
	});

	return { projects, createProjectForm };
};

export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) return;

		const createForm = await superValidate(request, CreateNewProjectSchema, {
			id: 'createForm'
		});

		if (!createForm.valid) {
			return message(createForm, 'Form submission failed.');
		}

		// Create the project
		const project = await locals.prisma.project.create({
			data: {
				name: createForm.data.name,
				description: createForm.data.description,
				isPublic: createForm.data.isPublic,
				columns: createForm.data.columns,
				rows: createForm.data.rows,
				user: {
					connect: {
						id: locals.user.id
					}
				}
			}
		});

		// Create the home page
		await locals.prisma.tilePage.create({
			data: {
				name: 'Home',
				Project: {
					connect: {
						id: project.id
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
							x: 0,
							y: 0
						}
					]
				}
			}
		});

		return message(createForm, 'good');
		// throw redirect(302, `/app/dashboard/projects`);
	}
};
