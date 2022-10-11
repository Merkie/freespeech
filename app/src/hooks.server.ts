import { router } from '$lib/server/trpc';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { createContext } from '$lib/server/trpc/context';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await createTRPCHandle({
		router,
		//@ts-ignore
		createContext,
		event,
		resolve
	});

	return response;
};
