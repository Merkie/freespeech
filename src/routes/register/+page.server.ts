import api from '$ts/client/api';

export const load = async ({ url }) => {
	url.host;
	const { google } = await api.auth.oauth.getOAuthUrls(url.origin);

	return {
		url: google
	};
};
