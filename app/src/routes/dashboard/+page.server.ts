import { redirect, type ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/resources';

export const load: ServerLoad = async ({ parent }) => {
	const auth = await parent(); // Get the auth data from the parent route
	if (!auth['_lucia']) throw redirect(302, '/'); // If the user is not logged in, redirect to the home page

	// Get a list of the user's projects from the database
	const projects = await client.project.findMany({
		where: {
			userId: auth['_lucia'].user.user_id
		},
		orderBy: {
			updated_at: 'desc'
		}
	});

	// if no projects, return a blank array
	if (!projects) {
		return { projects: [] };
	}

	// return the projects
	return { projects };
};
