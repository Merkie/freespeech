import { z } from 'zod';

const PageCreationSchema = z.object({
	name: z.string().min(1).max(50),
	projectid: z.string().min(1)
});

export default PageCreationSchema;
