import jwt from 'jsonwebtoken';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request, locals, cookies }) => {
	const form = await superValidate(await request.json(), z.object({
		email: z.string().email(),
		name: z.string().min(2),
		password: z.string().min(8)
	}));

	if (!form.valid)
		return json({ error: "Invalid form"})

	const existingUser = await locals.prisma.user.findUnique({ where: { email: form.data.email } });
	if (existingUser)
		return json({ error: "User with specified email already exists." });

	const hashedPassword = await bcrypt.hash(form.data.password, 10);
	const createdUser = await locals.prisma.user.create({
		data: {
			email: form.data.email,
			password: hashedPassword,
			name: form.data.name
		}
	});

	// create a signed token
	const token = jwt.sign({ id: createdUser.id }, JWT_SECRET, { expiresIn: '30d' });

	// set the token as a cookie
	cookies.set('token', token, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30
	});

	return json({ success: true });
};
