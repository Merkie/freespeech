import validateRequest from '$lib/ts/validateRequest';
import mongo from '$lib/resources/mongo';
import type { Project } from '$lib/types';
import { createId } from '@paralleldrive/cuid2';
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

	const pageid = createId();
	const projectid = (
		await mongo.collection<Project>('projects').insertOne({
			_id: createId(),
			name,
			columns,
			rows,
			slug: name.toLowerCase().replace(/ /g, '-') + '',
			userid,
			description: '',
			private: true,
			image: '',
			templates: [],
			pages: [
				{
					_id: pageid,
					name: 'home',
					tiles: [
						{
							_id: createId(),
							x: 0,
							y: 0,
							text: 'New Tile',
							userid,
							pageid
						}
					]
				}
			]
		})
	).insertedId;

	const project = await mongo.collection<Project>('projects').findOne({ _id: projectid });

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
