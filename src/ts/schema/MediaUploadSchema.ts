import { z } from 'zod';

const MediaUploadSchema = z.object({
	filename: z.string().min(1),
	base64data: z.string().min(1)
});

export default MediaUploadSchema;
