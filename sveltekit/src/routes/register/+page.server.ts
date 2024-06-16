import { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT } from '$env/static/private';

export const load = async () => {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

	url.searchParams.append('client_id', GOOGLE_CLIENT_ID);
	url.searchParams.append('redirect_uri', GOOGLE_OAUTH_REDIRECT);
	url.searchParams.append('access_type', 'offline');
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('prompt', 'consent');
	url.searchParams.append(
		'scope',
		[
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile'
		].join(' ')
	);

	return {
		url: url.toString()
	};
};
