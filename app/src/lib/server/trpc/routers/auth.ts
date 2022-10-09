// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { User } from '@prisma/client';

// bcrypt
import bcrypt from 'bcrypt';

// Creates an access token for a user
const create_access_token = async (user: User) => {
	return (
		await prismaClient.accessToken.create({
			data: {
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})
	).access_token;
};

export default router()
	.mutation('create_account', {
		input: z.object({
			email: z.string(),
			password: z.string()
		}),
		resolve: async ({ input }) => {
			// 1) Generate a hash from the given password
			const hash = await bcrypt.hash(input.password, 10);

			// 2) Create a new user in the database
			const user = await prismaClient.user.create({
				data: {
					identifier_token: input.email,
					email: input.email,
					hashed_password: hash
				}
			});

			// 3) Create a token
			const access_token = create_access_token(user);
			if (!access_token) return null;

			// 4) Return the token
			return access_token;
		}
	})
	.mutation('login', {
		input: z.object({
			email: z.string(),
			password: z.string()
		}),
		resolve: async ({ input }) => {
			// 1) Try to find the user given the email
			const user = await prismaClient.user.findUnique({
				where: {
					email: input.email
				}
			});
			if (!user) return null;

			// 2) Compare the password with the hashed password
			const result = await bcrypt.compare(input.password, user.hashed_password!);
			if (!result) return null;

			// 3) Create a token
			const access_token = create_access_token(user);
			if (!access_token) return null;

			// 4) Return the token
			return access_token;
		}
	});
