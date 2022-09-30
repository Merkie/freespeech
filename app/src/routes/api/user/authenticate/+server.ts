import { auth } from '$lib/lucia';
import { setCookie } from 'lucia-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body: { email: string; password: string } = await request.json();

	// Try to authenticate the user
	try {
		// Get session
		const userSession = await auth.authenticateUser('email', body.email, body.password);
		// Set the cookie
		setCookie(cookies, ...userSession.cookies);
	} catch (error) {
		return new Response(JSON.stringify({ message: 'error' }), { status: 200 });
	}

	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
};
