import { z } from 'zod';

const ProjectCreationSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().min(1).max(100).optional(),
	isPublic: z.boolean().optional()
});

export default ProjectCreationSchema;
