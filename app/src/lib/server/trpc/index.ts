// Trpc
import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';

// Routers
import auth from './routers/auth';
import user from './routers/user';
import project from './routers/project';
import page from './routers/page';
import tile from './routers/tile';
import s3 from './routers/s3';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// @ts-ignore
export const createContext = async ({ cookies }) => {
	// 1) Get the token from the user's cookies
	const access_token = cookies.get('freespeech-token');
	if (!access_token) return {};

	// 2) Try to find the user given the token
	const response = await prismaClient.accessToken.findUnique({
		where: {
			access_token
		},
		select: {
			user: {
				select: {
					hashed_password: false,
					id: true,
					identifier_token: true,
					email: true,
					username: true,
					image: true,
					theme: true,
					projects: true,
					access_tokens: true,
					tiles: true,
					tile_pages: true,
					s3_resources: true
				}
			}
		}
	});
	if (!response) return {};

	// 3) Return the user
	return response.user;
};

export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.transformer(trpcTransformer)
	.merge('auth:', auth)
	.merge('user:', user)
	.merge('project:', project)
	.merge('page:', page)
	.merge('tile:', tile)
	.merge('s3:', s3);

export type Router = typeof router;
