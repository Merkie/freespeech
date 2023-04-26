import { S3Client } from '@aws-sdk/client-s3';
import { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_REGION } from '$env/static/private';

const client = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_ACCESS_KEY
	}
});

export default client;
