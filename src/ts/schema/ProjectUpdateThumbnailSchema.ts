import { z } from 'zod';

export const ProjectUpdateThumbnailSchema = z.object({
	id: z.string().min(1),
	imageUrl: z.string().min(1)
});

export default ProjectUpdateThumbnailSchema;
