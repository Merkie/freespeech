export const POST = async ({ locals, request }) => {
	if (!locals.user) return new Response(null, { status: 401 });
	const { token } = await request.json();

	const emailVerificationToken = await locals.prisma.emailVerificationToken.findFirst({
		where: {
			userId: locals.user?.id,
			token
		}
	});

	if (!emailVerificationToken) {
		return new Response(JSON.stringify({ success: false }), { status: 401 });
	}

	await locals.prisma.user.update({
		where: {
			id: locals.user.id
		},
		data: {
			emailVerified: true
		}
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
