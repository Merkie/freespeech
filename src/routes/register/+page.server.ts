import api from '$ts/client/api';

export const load = async ({ url }) => {
	const { google } = await api.auth.oauth.getOAuthUrls(url.origin);

	return {
		url: google
	};
};
