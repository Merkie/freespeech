import validateRequest from '$lib/helpers/validateRequest';
import prisma from '$lib/resources/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const createProject = async ({
	name,
	columns,
	rows,
	userid
}: {
	name: string;
	columns: number;
	rows: number;
	userid: string;
}) => {
	const schema = z.object({
		name: z.string(),
		columns: z.number(),
		rows: z.number(),
		userid: z.string()
	});

	if (!schema.safeParse({ name, columns, rows, userid }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	const tile = await prisma.tile.create({
		data: {
			x: 0,
			y: 0,
			text: 'New Tile',
			user: {
				connect: {
					id: userid
				}
			}
		}
	});

	const page = await prisma.page.create({
		data: {
			name: 'home',
			user: {
				connect: {
					id: userid
				}
			},
			tiles: {
				connect: {
					id: tile.id
				}
			}
		}
	});

	const project = await prisma.project.create({
		data: {
			name,
			columns,
			rows,
			slug: name.toLowerCase().replace(/ /g, '-'),
			user: {
				connect: {
					id: userid
				}
			},
			pages: {
				connect: {
					id: page.id
				}
			}
		},
		include: {
			pages: {
				include: {
					tiles: true
				}
			}
		}
	});

	return {
		body: {
			project,
			success: true
		},
		status: 200
	};
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await validateRequest(request);
	if (!user) {
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400
		});
	}
	const json = await request.json();
	const result = await createProject({ ...json, userid: user.id });
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
