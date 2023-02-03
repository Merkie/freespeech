import type { RequestHandler } from './$types';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongo from '$lib/resources/mongo';
import type { ObjectId } from 'mongodb';
import { createId } from '@paralleldrive/cuid2';

export const createUser = async ({
	email,
	password,
	name
}: {
	email: string;
	password: string;
	name: string;
}) => {
	// Schema for the request body
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
		name: z.string().min(2),
		captcha: z.string().optional(),
		captchaHash: z.string().optional()
	});

	// Validate the request body
	if (!schema.safeParse({ email, password, name }).success) {
		return {
			status: 400,
			body: { success: false, message: 'Invalid request body' }
		};
	}

	// Check if the user already exists
	const userExists = await mongo.collection('users').findOne({ email });

	// If the user exists, return an error
	if (userExists) {
		return {
			status: 400,
			body: { success: false, message: 'User already exists' }
		};
	}

	// hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create the user
	await mongo.collection('users').insertOne({
		_id: createId() as unknown as ObjectId,
		email,
		hashedPassword,
		name
	});

	const user = await mongo.collection('users').findOne({ email });

	// remove the hashed password from the user object
	delete (user as any).hashedPassword;

	//  console.log(user);

	// create the jwt
	const token = jwt.sign(user as any, process.env.SECRET + '', {
		expiresIn: '7d'
	});

	// return the user and the token
	return { status: 200, body: { success: true, user, token } };
};

export const POST: RequestHandler = async ({ request }) => {
	const result = await createUser(await request.json());
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
