import { z } from 'zod';
const MediaDeleteSchema = z.object({
	url: z.string()
});
export default MediaDeleteSchema;
