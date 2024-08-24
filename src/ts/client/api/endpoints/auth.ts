import type { User } from '$ts/common/types';
import { fetchFromAPI } from '../util';

const auth = {
	me,
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
	const response = (await fetchFromAPI({
		path: '/auth/oauth-urls',
		method: 'GET'
	})) as {
		google: string;
	};

	return response;
}

async function processGoogleOAuth(params: string) {
	const response = (await fetchFromAPI({
		path: '/auth/oauth/google' + params,
		method: 'GET'
	})) as {
		token: string;
	};

	return response;
}

async function processEmailLogin(body: { email: string; password: string }) {
	const response = (await fetchFromAPI({
		path: '/auth/login',
		method: 'POST',
		body
	})) as {
		token: string;
		error: string;
	};

	return response;
}

async function registerWithEmail(body: { email: string; name: string; password: string }) {
	const response = (await fetchFromAPI({
		path: '/auth/register',
		method: 'POST',
		body
	})) as {
		token: string;
		error: string;
	};

	return response;
}

async function me(token?: string) {
	const response = (await fetchFromAPI({
		path: '/auth/me',
		method: 'GET',
		token
	})) as {
		user: User;
		error: string;
	};

	return response;
}
