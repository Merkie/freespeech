// Trpc
import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import type { IMeta } from './IMeta';
// Routers
import auth from './routers/auth';
import user from './routers/user';
import project from './routers/project';
import page from './routers/page';
import tile from './routers/tile';
import s3 from './routers/s3';

// Prisma
import prismaClient from '$lib/server/prismaClient';
import { TRPCError } from '@trpc/server';
import type { Context } from './context';

const createRouter = () => {
	return trpc.router<Context, IMeta>();
};

export const router = createRouter()
	.middleware(async ({ meta, next, ctx }) => {
		// only check authorization if enabled
		// console.log(meta?.doesNotNeedAuthentication);
		if (meta?.doesNotNeedAuthentication || ctx.user) {
			return next();
		}
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	})
	.transformer(trpcTransformer)
	.merge('auth:', auth)
	.merge('user:', user)
	.merge('project:', project)
	.merge('page:', page)
	.merge('tile:', tile)
	.merge('s3:', s3);

export type Router = typeof router;
