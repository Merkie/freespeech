import type { TilePage } from '$ts/common/types.js';
import { R2_BUCKET } from '$env/static/private';
import s3 from '$ts/server/s3';

export const load = async ({ locals }) => {
	if (!locals.user) return { files: [] };

	const deleteFile = async (url: string) => {
		const media = await locals.prisma.userMedia.findFirst({
			where: {
				url: url,
				userId: locals.user?.id
			}
		});

		// Extract the key from the media URL
		const key = url.replace(/^https:\/\/pub-3aabe8e9655b4a5eb94c0efbaa7142a1\.r2\.dev\//, '');

		// Delete the media from R2 storage
		const deleteResponse = await s3
			.deleteObject({
				Bucket: R2_BUCKET,
				Key: key
			})
			.promise();

		// Check if the deletion was successful
		// if (deleteResponse.status !== 204) return false;

		// Delete the media from the database
		await locals.prisma.userMedia.delete({
			where: {
				id: media?.id
			}
		});

		return true;
	};

	// Query the database for all the user's media files
	const userMedia = await locals.prisma.userMedia.findMany({
		where: {
			user: {
				id: locals.user.id
			}
		}
	});

	// Fetch all projects from the user
	const userProjects = await locals.prisma.project.findMany({
		where: {
			user: {
				id: locals.user.id
			}
		},
		include: {
			pages: true
		}
	});

	// Get all the image URLs from the user's projects
	const imageUrls: string[] = userProjects.flatMap((project) =>
		project.pages.flatMap((page) =>
			(page as TilePage)?.data?.tiles.flatMap((tile) => tile?.image ?? [])
		)
	);

	const thumbnailUrls = userProjects.map((project) => {
		if (project.imageUrl) return project.imageUrl;
	});

	const mediaInUse = [...imageUrls, ...thumbnailUrls];

	// Collect all the media URLs that are not in use
	const unusedMedia = userMedia.filter((media) => !mediaInUse.includes(media.url));

	// Delete all unused media using Promise.all
	const deletionResults = await Promise.all(
		unusedMedia.map(async (media) => {
			const success = await deleteFile(media.url);
			return success;
		})
	);

	// Count the number of deletions that failed
	const failures = deletionResults.filter((result) => !result).length;

	return { failures };
};
