import { createContext, router } from '$lib/server/trpc';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await createTRPCHandle({
		router,
		createContext,
		event,
		resolve
	});

	return response;
};
