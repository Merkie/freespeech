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
		register: registerWithEmail,
		forgotPassword: sendForgotPasswordEmail,
		resetPassword: processPasswordReset
	}
};

export default auth;

async function getOAuthUrls(origin: string) {
	const response = (await fetchFromAPI({
		path: '/auth/oauth-urls',
		method: 'POST',
		body: {
			origin
		}
	})) as {
		google: string;
	};

	return response;
}

async function processGoogleOAuth(origin: string, params: string) {
	const response = (await fetchFromAPI({
		path: '/auth/oauth/google',
		method: 'POST',
		body: {
			origin,
			code: new URLSearchParams(params).get('code') as string
		}
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

async function sendForgotPasswordEmail(body: { email: string }) {
	const response = (await fetchFromAPI({
		path: '/auth/forgot-password',
		method: 'POST',
		body
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}

async function processPasswordReset(body: { token: string; password: string }) {
	const response = (await fetchFromAPI({
		path: '/auth/reset-password',
		method: 'POST',
		body
	})) as {
		success: boolean;
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
