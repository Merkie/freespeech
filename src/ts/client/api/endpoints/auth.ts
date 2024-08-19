import { PUBLIC_API_URL } from '$env/static/public';

const auth = {
	oauth: {
		getOAuthUrls,
		google: processGoogleOAuth
	}
};

export default auth;

async function getOAuthUrls() {
	const response = await fetch(PUBLIC_API_URL + '/auth/oauth-urls');
	const data = await response.json();

	return data as {
		google: string;
	};
}

async function processGoogleOAuth(params: string) {
	const response = await fetch(PUBLIC_API_URL + '/auth/oauth/google' + params);
	const data = await response.json();

	return data as {
		token: string;
	};
}
