import prisma from '$ts/server/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	const projects = await prisma.project.findMany({
		where: {
			userId: locals.user.id
		}
	});

	return { projects };
};
