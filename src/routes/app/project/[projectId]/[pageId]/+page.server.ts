import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { prisma, user }, params: { projectId, pageId } }) => {
	const page = await prisma.tilePage.findFirst({
		where: {
			id: pageId,
			userId: user.id,
			projectId: projectId
		},
		include: {
			tiles: true
		}
	});

	if (!page) throw redirect(302, '/app/dashboard/projects');

	return {
		page
	};
};
