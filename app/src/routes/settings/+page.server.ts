import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const auth = await parent();
	if (!auth['_lucia']) throw redirect(302, '/');
};
