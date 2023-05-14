import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

const UserCreationSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});

export const load = async () => {
	// Server API:
	const form = await superValidate(UserCreationSchema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request, locals, getClientAddress, cookies }) => {
		const form = await superValidate(request, UserCreationSchema);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return message(form, 'Invalid form');
		}

		// Check if the passwords match
		if (form.data.password !== form.data.confirmPassword) {
			return message(form, 'Passwords do not match.');
		}

		// Check if a user with that email exists
		if (await locals.prisma.user.findUnique({ where: { email: form.data.email } })) {
			return message(form, 'A user already exists with the specified email.', {
				status: 409
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(form.data.password, 10);

		// Create the user
		const user = await locals.prisma.user.create({
			data: {
				email: form.data.email,
				password: hashedPassword,
				name: form.data.name
			}
		});

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

		// Redirect to the dashboard
		throw redirect(302, '/verify-email');
	}
};
