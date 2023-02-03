import validateRequest from '$lib/helpers/validateRequest';
import mongo from '$lib/resources/mongo';
import { createId } from '@paralleldrive/cuid2';
import type { RequestHandler } from '@sveltejs/kit';
import type { ObjectId } from 'mongodb';
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

	const projectid = (
		await mongo.collection('projects').insertOne({
			_id: createId() as unknown as ObjectId,
			name,
			columns,
			rows,
			slug: name.toLowerCase().replace(/ /g, '-'),
			userid,
			pages: [
				{
					_id: createId() as unknown as ObjectId,
					name: 'home',
					tiles: [
						{
							_id: createId() as unknown as ObjectId,
							x: 0,
							y: 0,
							text: 'New Tile'
						}
					]
				}
			]
		})
	).insertedId;

	const project = await mongo.collection('projects').findOne({ _id: projectid });

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
	const result = await createProject({
		...json,
		userid: user._id
	});
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
