import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT,
	JWT_SECRET
} from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const GET = async ({ url, cookies, locals: { prisma } }) => {
	const code = url.searchParams.get('code');

	if (!code) return json({ error: 'No code provided' });

	const { access_token } = await getAccessToken(code);

	if (!access_token) return json({ error: 'No access token.' });

	const profile = await getProfile(access_token);

	if (!profile || !profile.email) return json({ error: 'No profile or email.' });

	const existingUser = await prisma.user.findUnique({ where: { email: profile.email } });

	let tokenUserId = '';

	if (existingUser) {
		tokenUserId = existingUser.id;
	} else {
		const createdUser = await prisma.user.create({
			data: {
				email: profile.email,
				name: profile.name,
				profileImgUrl: profile.picture
			}
		});

		tokenUserId = createdUser.id;
	}

	const token = jwt.sign({ id: tokenUserId }, JWT_SECRET, { expiresIn: '30d' });

	cookies.set('token', token, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30
	});

	throw redirect(307, '/app/dashboard');
};

async function getAccessToken(code: string) {
	const url = new URL('https://oauth2.googleapis.com/token');

	url.searchParams.append('client_id', GOOGLE_CLIENT_ID);
	url.searchParams.append('client_secret', GOOGLE_CLIENT_SECRET);
	url.searchParams.append('code', code);
	url.searchParams.append('grant_type', 'authorization_code');
	url.searchParams.append('redirect_uri', GOOGLE_OAUTH_REDIRECT);

	const response = await fetch(url, {
		method: 'POST'
	});

	return response.json() as Promise<{
		access_token: string;
	}>;
}

async function getProfile(access_token: string) {
	const url = new URL('https://www.googleapis.com/oauth2/v2/userinfo');

	url.searchParams.append('access_token', access_token);

	const response = await fetch(url);

	return response.json() as Promise<{
		id: string;
		email: string;
		name: string;
		picture: string;
	}>;
}
