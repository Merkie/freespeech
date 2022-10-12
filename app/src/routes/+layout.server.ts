import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';

const noAuthNeededPages = ['/portal', '/favicon.ico', '/', '/app'];

// @ts-ignore
export const load: Load = async ({ fetch, cookies, url }) => {
	if (noAuthNeededPages.includes(url.pathname)) {
		try {
			return await trpc(fetch).query(`user:me`);
		} catch (e) {}
		return {};
	}
	return await trpc(fetch).query(`user:me`);
};
