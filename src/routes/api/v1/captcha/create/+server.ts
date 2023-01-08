import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import captcha from 'trek-captcha';

export const createCaptcha = async () => {
	const { token, buffer } = await captcha({ style: 7 });
	const base64Image = buffer.toString('base64');
	const hash = await bcrypt.hash(token, 10);
	return {
		captcha: {
			image: `data:image/png;base64,${base64Image}`,
			hash
		}
	};
};

export const GET: RequestHandler = async () => {
	const result = await createCaptcha();
	return new Response(JSON.stringify(result.captcha), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
