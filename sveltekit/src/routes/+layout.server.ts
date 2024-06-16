import { R2_PUBLIC_URL } from '$env/static/private';

export const load = async ({ locals }) => {
	return {
		media_uri: R2_PUBLIC_URL,
		user: locals.user
	};
};
