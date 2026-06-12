import api from '$ts/client/api';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, cookies }) => {
	const oauthResponse = await api.auth.oauth.google(url.origin, url.search);
	// Sign-ins started from the native app carry state=app; hand the token
	// back to it via its custom scheme instead of the web dashboard.
	const fromApp = url.searchParams.get('state') === 'app';

	if (oauthResponse.token) {
		if (fromApp) {
			throw redirect(307, `freespeechaac://auth?token=${encodeURIComponent(oauthResponse.token)}`);
		}
		cookies.set('token', oauthResponse.token, {
			path: '/',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(307, '/app/dashboard/projects');
	} else {
		throw redirect(307, fromApp ? 'freespeechaac://auth?error=oauth_failed' : '/login');
	}
};
