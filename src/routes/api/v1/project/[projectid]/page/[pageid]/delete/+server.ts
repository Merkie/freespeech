import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { pageid }, locals }) => {
	const page = await locals.prisma.tilePage.findUnique({
		where: {
			id: pageid,
			userId: locals.user.id
		}
	});

	if (!page)
		return json({
			error: 'Page not found.'
		});

	await locals.prisma.tilePage.delete({
		where: {
			id: pageid
		}
	});

	return json({
		message: 'Page deleted successfully.'
	});
};
