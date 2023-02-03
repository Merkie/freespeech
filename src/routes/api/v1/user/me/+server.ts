import validateRequest from '$lib/helpers/validateRequest';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const result = await validateRequest(request);
	//  console.log(result);
	if (!result) {
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400
		});
	}
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
