import jwt from 'jsonwebtoken';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request, locals: { prisma }, cookies }) => {
	const schema = z.object({
		email: z.string().email(),
		name: z.string().min(2),
		password: z.string().min(8)
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
	if (existingUser) return json({ error: 'User with specified email already exists.' });

	const hashedPassword = bcrypt.hashSync(body.password, 10);
	const createdUser = await prisma.user.create({
		data: {
			email: body.email,
			password: hashedPassword,
			name: body.name
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
