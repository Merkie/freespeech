import { z } from 'zod';
import UserLoginSchema from '$ts/schema/UserLoginSchema';
import prisma from '$ts/server/prisma.js';
import bcrypt from 'bcrypt';

export const POST = async ({ request, cookies, locals, getClientAddress }) => {
	// Validate the request body
	let body;
	try {
		body = UserLoginSchema.parse(await request.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(JSON.stringify({ error: 'An error occured when validating form.' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		return new Response(JSON.stringify({ error: 'An unknown error occured.' }), { status: 500 });
	}

	const user = await prisma.user.findUnique({ where: { email: body.email } });

	// Check if the user already exists
	if (!user) {
		return new Response(JSON.stringify({ error: 'A user with that email does not exist.' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// Check if the password is correct
	if (!(await bcrypt.compare(body.password, user.password))) {
		return new Response(JSON.stringify({ error: 'Incorrect password.' }), {
			status: 401,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// Create the VerficationToken
	const verificationToken = await prisma.verificationToken.create({
		data: {
			user: {
				connect: {
					id: user.id
				}
			},
			token: crypto.getRandomValues(new Uint8Array(32)) + '',
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
			ip: getClientAddress(),
			userAgent: request.headers.get('User-Agent') || 'none'
		}
	});

	// Set the header
	cookies.set('verificationToken', verificationToken.token, {
		expires: verificationToken.expiresAt,
		path: '/'
	});

	locals.user = user;

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
