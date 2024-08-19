import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const body = await request.json();

	if (body.token) {
		cookies.set('token', body.token, {
			path: '/',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 30
		});
	}

	return json({ success: true });
};
