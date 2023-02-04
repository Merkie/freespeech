import cloudflarer2 from 'cloudflare-r2';
export default new cloudflarer2({
	accessKey: process.env.R2_ACCESS_KEY_ID,
	secretKey: process.env.R2_SECRET_ACCESS_KEY,
	accountId: process.env.R2_ACCOUNT_ID,
	region: 'auto'
});
