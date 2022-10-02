import { auth } from '$lib/lucia';
import { client } from '$lib/prisma';

export const load = auth.handleServerSession(async ({ request }) => {
	// Try to return the user theme
	// NOTE: This can also work with language and other settings
	try {
		// Get user from lucia
		const user = await auth.validateRequestByCookie(request);
		// Fetch the theme fresh from prisma
		const theme = (
			await client.user.findFirst({
				where: {
					id: user.user.user_id
				}
			})
		)?.theme;
		// If there's a theme return it
		if (theme) return { theme };
	} catch (error) {}
});
