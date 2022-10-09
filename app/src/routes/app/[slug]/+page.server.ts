import type { Load } from '@sveltejs/kit';
import trpc from '$lib/client/trpc';

export const load: Load = async ({ params }) => {
	// 1) Get slug
	const { slug } = params;
	// 2) Get and return project from id
	return await trpc().query('project:fetch', slug + '');
};
