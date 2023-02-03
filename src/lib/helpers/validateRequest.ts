import type { Project, User } from '$lib/types';
import jwt from 'jsonwebtoken';
import mongo from '$lib/resources/mongo';
import type { UserExpanded } from '$lib/stores';

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
export default async (request: Request): Promise<UserExpanded | null> => {
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

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const user = await mongo.collection('users').findOne({ _id: (decoded as User)._id });

	const projects = await mongo
		.collection('projects')
		.find({ userid: (decoded as { _id: string })._id.toString() })
		.toArray();

	// If there is no user, return null
	if (!user) {
		return null;
	}
	// Delete the password from the user
	delete (user as any).password;

	// Return the user
	return {
		...user,
		projects
	} as unknown as UserExpanded;
};
