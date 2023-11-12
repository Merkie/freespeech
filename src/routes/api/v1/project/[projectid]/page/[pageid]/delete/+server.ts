import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { pageid }, locals: { prisma, user } }) => {
	const page = await prisma.tilePage.findUnique({
		where: {
			id: pageid,
			userId: user.id
		}
	});

	if (!page)
		return json({
			error: 'Page not found.'
		});

	await prisma.tilePage.delete({
		where: {
			id: pageid
		}
	});

	return json({
		message: 'Page deleted successfully.'
	});
};
