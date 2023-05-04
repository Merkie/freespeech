import { z } from 'zod';

export const ElevenLabsTTSSchema = z.object({
	name: z.string().min(1),
	text: z.string().min(1).max(100)
});

export default ElevenLabsTTSSchema;
