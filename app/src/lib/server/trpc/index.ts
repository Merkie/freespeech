// dotenv
import dotenv from 'dotenv';
dotenv.config();

// Trpc
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import { TRPCError } from '@trpc/server';
import type { IMeta } from './IMeta';
import type { Context } from './context';

// Routers
import auth from './routers/auth';
import user from './routers/user';
import project from './routers/project';
import page from './routers/page';
import tile from './routers/tile';
import s3 from './routers/s3';
import tts from './routers/tts';
import openai from './routers/openai';

const createRouter = () => {
	return trpc.router<Context, IMeta>();
};

export const router = createRouter()
	.middleware(async ({ meta, next, ctx }) => {
		// checks to see if the doesNotNeedAuthentication
		// option is true, or if the user is already authenticated.
		if (meta?.doesNotNeedAuthentication || ctx.user) {
			return next();
		}
		// if the user is not authenticated, throw an error.
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	})
	.transformer(trpcTransformer)
	.merge('auth:', auth)
	.merge('user:', user)
	.merge('project:', project)
	.merge('page:', page)
	.merge('tile:', tile)
	// external connections
	.merge('s3:', s3) // AWS
	.merge('tts:', tts) // Azure, *AWS, *Google
	.merge('openai:', openai); // OpenAI

export type Router = typeof router;
