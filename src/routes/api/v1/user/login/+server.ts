import { OneWeek } from '$ts/server/utils';
import bcrypt from 'bcrypt';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const POST = async ({ request, locals, getClientAddress, cookies }) => {
	const form = await superValidate(await request.json(), LoginSchema);

	if (!form.valid)
		return new Response(JSON.stringify({ error: 'Invalid form' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	const fetchedUser = await locals.prisma.user.findUnique({ where: { email: form.data.email } });
	if (!fetchedUser)
		return new Response(JSON.stringify({ error: 'User with specified email does not exist.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	if (!(await bcrypt.compare(form.data.password, fetchedUser.password)))
		return new Response(JSON.stringify({ error: 'The entered password is incorrect.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});

	const verfTokenForUser = await locals.prisma.verificationToken.create({
		data: {
			user: {
				connect: {
					id: fetchedUser.id
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

	locals.user = fetchedUser;

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
