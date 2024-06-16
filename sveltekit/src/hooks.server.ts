import prisma from '$ts/server/prisma';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { User } from '@prisma/client';
import { json, redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const cookie = event.cookies.get('token');

	// Add prisma to the locals
	event.locals.prisma = prisma;

	// Decode the token and add user to locals
	if (cookie) {
		let decodedToken: { id: string } | undefined;

		try {
			decodedToken = jwt.verify(cookie, JWT_SECRET) as { id: string };
		} catch {
			decodedToken = undefined;
		}

		// If the token is valid, add the user to the locals
		if (decodedToken !== undefined) {
			const fetchedUser = await prisma.user.findUnique({ where: { id: decodedToken.id } });
			if (fetchedUser) {
				delete (fetchedUser as { password?: string }).password;
				event.locals.user = fetchedUser as Omit<User, 'password'>;
			}
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
