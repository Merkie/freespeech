import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request, locals, cookies }) => {
	const form = await superValidate(await request.json(), z.object({
		email: z.string().email(),
		password: z.string()
	}));

	if (!form.valid)
		return json({ error: 'Invalid form'});

	// Fetch the user from the database
	const fetchedUser = await locals.prisma.user.findUnique({ where: { email: form.data.email } });
	if (!fetchedUser)
		return new Response(JSON.stringify({ error: 'User with specified email does not exist.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	// Compare the two passwords
	const doPasswordsMatch = await bcrypt.compare(form.data.password, fetchedUser.password);
	if (!doPasswordsMatch)
		return json({ error: 'Invalid password.' });

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
