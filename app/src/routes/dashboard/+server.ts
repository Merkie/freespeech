import trpc from '$lib/client/trpc';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	throw redirect(302, '/dashboard/account');
};
