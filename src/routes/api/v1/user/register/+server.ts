import { OneWeek } from '$ts/server/utils';
import bcrypt from 'bcrypt';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const RegisterSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});

export const POST = async ({ request, locals, getClientAddress, cookies }) => {
	const form = await superValidate(await request.json(), RegisterSchema);

	if (!form.valid)
		return new Response(JSON.stringify({ error: 'Invalid form' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	if (form.data.password !== form.data.confirmPassword)
		return new Response(JSON.stringify({ error: 'Passwords do not match' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	const existingUser = await locals.prisma.user.findUnique({ where: { email: form.data.email } });
	if (existingUser)
		return new Response(
			JSON.stringify({ error: 'A user already exists with the specified email.' }),
			{
				status: 409,
				headers: { 'Content-Type': 'application/json' }
			}
		);

	const hashedPassword = await bcrypt.hash(form.data.password, 10);
	const createdUser = await locals.prisma.user.create({
		data: {
			email: form.data.email,
			password: hashedPassword,
			name: form.data.name
		}
	});

	const verfTokenForUser = await locals.prisma.verificationToken.create({
		data: {
			user: {
				connect: {
					id: createdUser.id
				}
			},
			token: crypto.getRandomValues(new Uint8Array(32)) + '',
			expiresAt: new Date(Date.now() + OneWeek),
			ip: getClientAddress(),
			userAgent: request.headers.get('User-Agent') || 'none'
		}
	});

	cookies.set('verificationToken', verfTokenForUser.token, {
		expires: verfTokenForUser.expiresAt,
		path: '/'
	});

	locals.user = createdUser;

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
