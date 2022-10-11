// @ts-ignore
import * as trpc from '@trpc/server';

import type * as trpcNext from '@trpc/server/adapters/next';
import prismaClient from '../prismaClient';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
	cookies: any;
	// session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
	// 1) Get the token from the user's cookies
	const access_token = _opts.cookies.get('freespeech-token');
	if (!access_token) return { user: null };

	const response = await prismaClient.accessToken.findUnique({
		where: {
			access_token
		},
		select: {
			access_token: true,
			user: {
				select: {
					hashed_password: false,
					id: true,
					identifier_token: true,
					email: true,
					name: true,
					image: true,
					theme: true,
					projects: true,
					access_tokens: true,
					tiles: true,
					tile_pages: true,
					s3_resources: true,
					organization: true
				}
			}
		}
	});
	return {
		user: response?.user
	};
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions): Promise<Context> {
	// for API-response caching see https://trpc.io/docs/caching
	return await createContextInner(opts);
}
