import { json } from '@sveltejs/kit';

export const DELETE = async ({ params: { tileId }, locals: { prisma, user } }) => {
	const tile = await prisma.tile.findUnique({
		where: {
			id: tileId,
			TilePage: {
				userId: user.id
			}
		}
	});

	if (!tile)
		return json({
			error: 'Tile not found.'
		});

	await prisma.tile.delete({
		where: {
			id: tile.id
		}
	});

	return json({
		message: 'Tile deleted successfully.'
	});
};
