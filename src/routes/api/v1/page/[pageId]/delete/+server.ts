import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { pageId }, locals: { prisma, user } }) => {
	const page = await prisma.tilePage.findUnique({
		where: {
			id: pageId,
			userId: user.id
		}
	});

	if (!page)
		return json({
			error: 'Page not found.'
		});

	await prisma.tilePage.delete({
		where: {
			id: pageId
		}
	});

	return json({
		message: 'Page deleted successfully.'
	});
};
