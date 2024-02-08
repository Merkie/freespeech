import { json } from '@sveltejs/kit';

export const GET = async ({ locals: { prisma } }) => {
	await Promise.all(
		(await prisma.tile.findMany()).map((tile) => {
			const oldImage = tile.image;
			if (oldImage.trim().length === 0) return;
			const newImage = `https://media.freespeechaac.com${oldImage}`;
			console.log({
				oldImage,
				newImage
			});
			// return prisma.tile.update({
			//   where: { id: tile.id },
			//   data: { image: newImage }
			// });
		})
	);
	return json({ success: true });
};
