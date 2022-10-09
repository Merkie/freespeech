import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';

export const load: Load = async ({ fetch }) => {
	const user = await trpc(fetch).query(`user:me`);
	return { user };
};
