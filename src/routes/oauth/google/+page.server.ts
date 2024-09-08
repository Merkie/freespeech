import api from '$ts/client/api';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, cookies }) => {
	const oauthResponse = await api.auth.oauth.google(url.origin, url.search);

	if (oauthResponse.token) {
		cookies.set('token', oauthResponse.token, {
			path: '/',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(307, '/app/dashboard/projects');
	} else {
		throw redirect(307, '/login');
	}
};
