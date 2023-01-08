import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../resources/prisma';

const cookieStringToObject = (cookieString: string) => {
	// Split the cookie string into an array of cookies
	const cookies = cookieString.split('; ');
	// Create an object to store the cookies
	const cookieObject: { [key: string]: string } = {};
	// Loop through the cookies and add them to the object
	cookies.forEach((cookie) => {
		const [key, value] = cookie.split('=');
		cookieObject[key] = value;
	});
	// Return the object
	return cookieObject;
};

// return the user if the request is valid, otherwise return null
export default async (request: Request): Promise<User | null> => {
	// Get the cookies from the request
	const cookies = cookieStringToObject(request.headers.get('Cookie') + '');
	// If there is no token, return null
	if (!cookies.token) {
		return null;
	}
	// Decode the token
	const decoded = jwt.decode(cookies.token);
	// If there is no decoded token, return null
	if (!decoded) {
		return null;
	}
	// Find the user in the database
	const user = await prisma.user.findFirst({
		where: {
			id: (decoded as { id: string }).id
		},
		include: {
			projects: true
		}
	});
	// If there is no user, return null
	if (!user) {
		return null;
	}
	// Delete the password from the user
	delete (user as any).password;
	// Return the user
	return user;
};
