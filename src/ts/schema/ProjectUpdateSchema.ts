import { z } from 'zod';

const ProjectUpdateSchema = z.object({
	id: z.string().min(1),
	pageName: z.string().min(3).max(50),
	data: z.any()
});

export default ProjectUpdateSchema;
