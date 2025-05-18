import { PUBLIC_R2_URL } from '$env/static/public';

export const load = async ({ locals }) => {
	return {
		media_uri: PUBLIC_R2_URL,
		user: locals.user
	};
};
