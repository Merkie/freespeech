import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
dotenv.config();

export const s3 = new AWS.S3();
export const client = new PrismaClient();
export const auth = lucia({
	adapter: prisma(client),
	secret: process.env.SECRET || 'secret',
	//@ts-ignore
	env: process.env.ENVIRONMENT || 'DEV'
});
