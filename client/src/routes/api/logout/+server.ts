export const GET = async ({ cookies }) => {
	cookies.set('token', '', {
		path: '/',
		httpOnly: true
	});
	return new Response('Successfully logged out.');
};
