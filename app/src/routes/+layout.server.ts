import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';

const noAuthNeededPages = ['/portal', '/'];

// @ts-ignore
export const load: Load = async ({ fetch, cookies, url }) => {
	if (noAuthNeededPages.includes(url.pathname)) {
		return {};
	}
	return await trpc(fetch).query(`user:me`);
};
