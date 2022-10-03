import { client } from '$lib/resources';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, params }) => {
	const auth = await parent(); // Get the auth data from the parent route
	if (!auth['_lucia']) throw redirect(302, '/'); // If the user is not logged in, redirect to the home page

	// Chain get to get the entire project
	// TODO: Cache this in the browser
	const project = await client.project.findFirst({
		where: {
			id: params.slug + '', // TODO: Change this to have a slug,
			userId: auth['_lucia'].user.user_id
		},
		include: {
			user: true,
			pages: {
				include: {
					tiles: true
				}
			}
		}
	});

	// if no projects, redirecrt back to dashboard
	if (!project) {
		throw redirect(302, '/dashboard');
	}
	// return the projects
	return { project };
};
