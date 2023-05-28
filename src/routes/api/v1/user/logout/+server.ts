export const GET = async ({ locals, cookies }) => {
	const reqVerificationToken = await locals.prisma.verificationToken.findFirst({
		where: {
			token: cookies.get('verificationToken')
		}
	});

	if (!reqVerificationToken) {
		return new Response(JSON.stringify({ error: 'Invalid or null token.' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	await locals.prisma.verificationToken.delete({
		where: {
			id: reqVerificationToken.id
		}
	});

	cookies.set('verfificationToken', '', {
		expires: new Date(0),
		path: '/'
	});

	locals.user = undefined;

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
