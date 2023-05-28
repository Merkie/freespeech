import transporter from '$ts/server/mail';

export const GET = async ({ locals }) => {
	if (!locals.user) return new Response(null, { status: 401 });

	let emailVerificationToken = await locals.prisma.emailVerificationToken.findFirst({
		where: {
			userId: locals.user?.id
		}
	});

	if (!emailVerificationToken) {
		// create
		emailVerificationToken = await locals.prisma.emailVerificationToken.create({
			data: {
				user: {
					connect: {
						id: locals.user.id
					}
				},
				token: Math.floor(100000 + Math.random() * 900000).toString()
			}
		});
	}

	// Define the email content
	const mailOptions = {
		from: 'noreply@freespeechaac.com',
		to: locals.user?.email,
		subject: `${emailVerificationToken.token} Is your Free Speech AAC email verification code`,
		text: `Your email verification code is ${emailVerificationToken.token}`
	};

	// Send the email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return new Response(JSON.stringify({ success: false }), { status: 500 });
		} else {
			console.log('Email sent:', info.response);
		}
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
