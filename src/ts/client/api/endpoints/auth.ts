import { PUBLIC_API_URL } from '$env/static/public';

const auth = {
	oauth: {
		getOAuthUrls,
		google: processGoogleOAuth
	},
	email: {
		login: processEmailLogin,
		register: registerWithEmail
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

async function processEmailLogin(body: { email: string; password: string }) {
	const response = await fetch(PUBLIC_API_URL + '/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	const data = await response.json();

	return data as {
		token: string;
		error: string;
	};
}

async function registerWithEmail(body: { email: string; name: string; password: string }) {
	const response = await fetch(PUBLIC_API_URL + '/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	const data = await response.json();

	return data as {
		token: string;
		error: string;
	};
}
