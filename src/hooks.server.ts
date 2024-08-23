import prisma from '$ts/server/prisma';
import { json, redirect } from '@sveltejs/kit';
import api from '$ts/client/api';

export async function handle({ event, resolve }) {
	const cookie = event.cookies.get('token');

	// Add prisma to the locals
	event.locals.prisma = prisma;

	// Decode the token and add user to locals
	if (cookie) {
		const meResponse = await api.auth.me(cookie);
		if (meResponse.user) {
			event.locals.user = meResponse.user;
		}
	}

	const pathname = event.url.pathname.toLowerCase();

	// API protection
	if (
		pathname.startsWith('/api/v1') &&
		!pathname.startsWith('/api/v1/auth') &&
		!event.locals.user
	) {
		return json({ error: 'Unauthorized request, please log in or create an account.' });
	}

	// App protection
	if (pathname.startsWith('/app') && !event.locals.user) {
		throw redirect(307, '/login');
	} else {
		return await resolve(event);
	}
}
