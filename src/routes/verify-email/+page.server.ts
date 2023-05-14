import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { redirect } from '@sveltejs/kit';

const VerifyEmailSchema = z.object({
	token: z.string().length(6)
});

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	// Server API:
	const form = await superValidate(VerifyEmailSchema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, VerifyEmailSchema);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return message(form, 'Invalid form.');
		}

		const emailVerificationToken = await locals.prisma.emailVerificationToken.findFirst({
			where: {
				userId: locals.user?.id,
				token: form.data.token
			}
		});

		if (!emailVerificationToken) {
			return message(form, 'The submitted token is invalid.');
		}

		await locals.prisma.user.update({
			where: {
				id: locals.user?.id
			},
			data: {
				emailVerified: true
			}
		});

		throw redirect(302, '/app');
	}
};
