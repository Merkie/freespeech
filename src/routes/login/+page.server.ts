import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const load = async () => {
	// Server API:
	const form = await superValidate(UserLoginSchema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request, locals, getClientAddress, cookies }) => {
		const form = await superValidate(request, UserLoginSchema);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return message(form, 'Invalid form');
		}

		// Find the user based on email
		const user = await locals.prisma.user.findUnique({ where: { email: form.data.email } });

		// Check if the user already exists
		if (!user) {
			return message(form, 'User with specified email does not exist.', {
				status: 404
			});
		}

		// Check if the password is correct
		if (!(await bcrypt.compare(form.data.password, user.password))) {
			return message(form, 'The entered password is incorrect.', {
				status: 401
			});
		}

		// Create the VerficationToken
		const verificationToken = await locals.prisma.verificationToken.create({
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

		// Set the user in locals
		locals.user = user;

		// Redirect to app home page
		throw redirect(302, '/app');
	}
};
