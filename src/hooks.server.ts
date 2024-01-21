import prisma from '$ts/server/prisma';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	// Add prisma to the locals
	event.locals.prisma = prisma;

	const tokenCookie = event.cookies.get('token');

	// Decode the token and add user to locals
	if (tokenCookie) {
		try {
			const decoded = jwt.verify(tokenCookie, JWT_SECRET) as { id: string };
			if (!decoded.id) throw new Error('Invalid token');

			const fetchedUser = await prisma.user.findUnique({ where: { id: decoded.id } });
			if (!fetchedUser) throw new Error('User not found');

			event.locals.user = fetchedUser;
			// eslint-disable-next-line no-empty
		} catch {}
	}

	const pathname = event.url.pathname.toLowerCase();

	// API protection
	if (pathname.startsWith('/api/v1') && !pathname.startsWith('/api/v1/auth') && !event.locals.user)
		return json({ error: 'Unauthorized request' }, { status: 401 });

	// App protection
	if (pathname.startsWith('/app') && !event.locals.user) throw redirect(307, '/login');

	return await resolve(event);
}
