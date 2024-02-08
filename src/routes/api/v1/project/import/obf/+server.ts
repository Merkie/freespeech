import type { OBFPage } from '$ts/common/openboardformat.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user, prisma } }) => {
	const page = (await request.json()) as OBFPage;

	const name = page.name;
	const columns = page.grid.columns;
	const rows = page.grid.rows;

	if (!name || !columns || !rows) return json({ error: 'Invalid request body' });

	const createdProject = await prisma.project.create({
		data: {
			name,
			description: '',
			isPublic: false,
			columns,
			rows,
			userId: user.id
		}
	});

	const createdHomepage = await prisma.tilePage.create({
		data: {
			name: 'Home',
			projectId: createdProject.id,
			userId: user.id
		}
	});

	await prisma.tile.createMany({
		data: page.grid.order
			.map((row, rowIndex) => {
				return row.map((item, itemIndex) => {
					if (!item) return;

					const obfButton = page.buttons.find((button) => button.id === item);
					if (!obfButton) return;

					const image = page.images.find((image) => image.id === obfButton.image_id)?.url || '';

					return {
						x: itemIndex,
						y: rowIndex,
						page: 0,
						text: obfButton.label || '',
						image,
						tilePageId: createdHomepage.id
					};
				});
			})
			.flat() as {
			x: number;
			y: number;
			page: number;
			text: string;
			image: string;
			tilePageId: string;
		}[]
	});

	return json({ success: true });
};
