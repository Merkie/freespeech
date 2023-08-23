import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
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
