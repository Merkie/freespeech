import prisma from '$ts/server/prisma';

export async function handle({ event, resolve }) {
	console.log(event);
	// get the token from the request cookies
	const cookie = event.cookies.get('verificationToken');

	const verificationToken = await prisma.verificationToken.findUnique({
		where: {
			token: cookie || ''
		},
		include: {
			user: true
		}
	});

	if (!verificationToken) {
		event.locals.user = undefined;
	} else {
		const secondsUntilTokenExpires = (verificationToken.expiresAt.getTime() - Date.now()) / 1000;

		// Delete the token if it has expired
		if (secondsUntilTokenExpires <= 0) {
			await prisma.verificationToken.delete({
				where: {
					id: verificationToken.id
				}
			});
			event.locals.user = undefined;
		} else {
			// If the token is not expired
			// Refresh the token if it is about to expire
			if (secondsUntilTokenExpires < 10000) {
				await prisma.verificationToken.update({
					where: {
						id: verificationToken.id
					},
					data: {
						expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
					}
				});
			}

			// Delete the password from the user object
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			delete verificationToken.user.password;

			event.locals.user = verificationToken.user;
		}
	}

	return await resolve(event);
}
