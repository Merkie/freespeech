import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
	endpoint: 'https://372f3e3f2eb8f357183f7362a089394b.r2.cloudflarestorage.com',
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});

export default client;
