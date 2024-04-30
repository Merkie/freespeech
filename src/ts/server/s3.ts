import { R2_ACCESS_KEY, R2_ACCOUNT_ID, R2_PUBLIC_URL, R2_SECRET_KEY } from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';
import { dev } from '$app/environment';

function getS3Client(): S3Client {
	if (dev) {
		return new S3Client({
			endpoint: R2_PUBLIC_URL,
			region: 'us-east-1',
			forcePathStyle: true,
			credentials: {
				accessKeyId: `${R2_ACCESS_KEY}`,
				secretAccessKey: `${R2_SECRET_KEY}`
			}
		});
	}

	return new S3Client({
		endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		region: 'auto',
		credentials: {
			accessKeyId: `${R2_ACCESS_KEY}`,
			secretAccessKey: `${R2_SECRET_KEY}`
		}
	});
}

const s3 = getS3Client();

export default s3;
