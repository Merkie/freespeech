import { z } from 'zod';
const MediaDeleteSchema = z.object({
	mediaId: z.string()
});
export default MediaDeleteSchema;
