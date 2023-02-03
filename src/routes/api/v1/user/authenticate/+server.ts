import type { RequestHandler } from './$types';
import { z } from 'zod';
import mongo from '$lib/resources/mongo';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyCaptcha from '$lib/helpers/verifyCaptcha';

export const authenticateUser = async ({
	email,
	password
}: {
	email: string;
	password: string;
}) => {
	// request schema
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
		captcha: z.string().optional(),
		captchaHash: z.string().optional()
	});

	// Validate the data
	if (!schema.safeParse({ email, password }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	// find the user
	const user = await mongo.collection('users').findOne({ email });

	// If there is no user with the given email, return an error
	if (!user) {
		return {
			status: 401,
			body: {
				success: false,
				message: 'Invalid email or password.'
			}
		};
	}

	// Compare the password with the hashed password stored in the database
	const isMatch = await bcrypt.compare(password, user.hashedPassword + '');

	// If the passwords don't match, return an error
	if (!isMatch) {
		return {
			status: 401,
			body: {
				success: false,
				message: 'Invalid email or password.'
			}
		};
	}

	// remove the hashed password from the user object
	delete (user as any).hashedPassword;

	// create the jwt
	const token = jwt.sign(user, process.env.SECRET + '', {
		expiresIn: '7d'
	});

	// return the user and the token
	return {
		status: 200,
		body: { user, token, success: true }
	};
};

export const POST: RequestHandler = async ({ request }) => {
	const json = await request.json();
	if (!(await verifyCaptcha({ input: json.captcha, hash: json.captchaHash }))) {
		return new Response(JSON.stringify({ success: false, message: 'Invalid captcha' }), {
			status: 400
		});
	}
	const result = await authenticateUser(json);
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
