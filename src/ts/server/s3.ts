import { R2_ACCESS_KEY, R2_ACCOUNT_ID, R2_SECRET_KEY } from '$env/static/private';
import S3 from 'aws-sdk/clients/s3.js';

const s3 = new S3({
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	accessKeyId: `${R2_ACCESS_KEY}`,
	secretAccessKey: `${R2_SECRET_KEY}`,
	signatureVersion: 'v4'
});

export default s3;
