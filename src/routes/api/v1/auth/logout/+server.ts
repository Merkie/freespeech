import { json } from "@sveltejs/kit";

export const GET = async ({ locals, cookies }) => {
	cookies.set('token', '', {
		expires: new Date(0),
		path: '/'
	});

	locals.user = undefined;

	return json({ success: true })
};
