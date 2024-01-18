import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request, locals: { prisma }, cookies }) => {
	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Fetch the user from the database
	const fetchedUser = await prisma.user.findUnique({ where: { email: body.email } });
	if (!fetchedUser)
		return new Response(JSON.stringify({ error: 'User with specified email does not exist.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	if (!fetchedUser.password) return json({ error: 'User does not have a password.' });

	// Compare the two passwords
	const doPasswordsMatch = bcrypt.compareSync(body.password, fetchedUser.password);
	if (!doPasswordsMatch) return json({ error: 'Invalid password.' });

	// create a signed token
	const token = jwt.sign({ id: fetchedUser.id }, JWT_SECRET, { expiresIn: '30d' });

	// set the token as a cookie
	cookies.set('token', token, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30
	});

	return json({ success: true });
};
