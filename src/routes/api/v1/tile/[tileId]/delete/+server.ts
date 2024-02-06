import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { tileId }, locals: { prisma, user } }) => {
	await prisma.tile.delete({
		where: {
			id: tileId,
			TilePage: {
				userId: user.id
			}
		}
	});

	return json({
		success: true
	});
};
