import nodemailer from 'nodemailer';
import { GMAIL_PASSWORD, GMAIL_USERNAME } from '$env/static/private';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: GMAIL_USERNAME,
		pass: GMAIL_PASSWORD
	}
});

export default transporter;
