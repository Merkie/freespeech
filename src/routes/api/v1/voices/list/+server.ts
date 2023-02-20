import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, fetch }) => {
	const voices = await (await fetch('https://tts.gay/api/v1/list')).json();
	return new Response(JSON.stringify(voices.voices), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
