import { z } from 'zod';

export const ElevenLabsTTSSchema = z.object({
	name: z.string().min(1),
	text: z.string().min(1).max(100)
});

export const MediaDeleteSchema = z.object({
	url: z.string()
});

export const MediaUploadSchema = z.object({
	filename: z.string().min(1),
	base64data: z.string().min(1)
});

export const PageCreationSchema = z.object({
	name: z.string().min(1).max(50),
	projectid: z.string().min(1)
});

export const ProjectUpdateSchema = z.object({
	id: z.string().min(1),
	pageName: z.string().min(3).max(50),
	data: z.any()
});

export const ProjectUpdateThumbnailSchema = z.object({
	id: z.string().min(1),
	imageUrl: z.string().min(1)
});
