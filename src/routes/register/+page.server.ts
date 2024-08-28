import api from '$ts/client/api';

export const load = async () => {
	const { google } = await api.auth.oauth.getOAuthUrls();

	return {
		url: google
	};
};
