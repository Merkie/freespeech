import prisma from '$ts/server/prisma';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { User } from '@prisma/client';

export async function handle({ event, resolve }) {
	const cookie = event.cookies.get('token');

	// Add prisma to the locals
	event.locals.prisma = prisma;

	// Decode the token and add user to locals
	if (cookie) {
		let decodedToken: { id: string };
		try {
			decodedToken = jwt.verify(cookie, JWT_SECRET) as { id: string };
		} catch (e) {
			event.locals.user = undefined;
			return await resolve(event);
		}
		const fetchedUser = await prisma.user.findUnique({ where: { id: decodedToken.id } });
		if (fetchedUser) {
			delete (fetchedUser as { password?: string }).password;
			event.locals.user = fetchedUser as Omit<User, 'password'>;
		} else {
			event.locals.user = undefined;
		}
	} else {
		event.locals.user = undefined;
	}

	return await resolve(event);
}
