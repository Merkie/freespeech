import { z } from 'zod';
import UserCreationSchema from '$ts/schema/UserCreationSchema';
import prisma from '$ts/server/prisma.js';
import bcrypt from 'bcrypt';

export const POST = async ({ request, cookies, locals, getClientAddress }) => {
	// Validate the request body
	let body;
	try {
		body = UserCreationSchema.parse(await request.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(JSON.stringify({ error: 'An error occured when validating form.' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		return new Response(JSON.stringify({ error: 'An unknown error occured.' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// Check if the user already exists
	if (await prisma.user.findUnique({ where: { email: body.email } })) {
		return new Response(JSON.stringify({ error: 'A user already exists with that email.' }), {
			status: 409,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(body.password, 10);

	// Create the user
	const user = await prisma.user.create({
		data: {
			email: body.email,
			password: hashedPassword,
			name: body.name
		}
	});

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
