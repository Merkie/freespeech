import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import { client } from './prisma';
import dotenv from 'dotenv';
dotenv.config();

export const auth = lucia({
	adapter: prisma(client),
	secret: process.env.SECRET || 'secret',
	env: process.env.ENVIRONMENT || 'DEV'
});
