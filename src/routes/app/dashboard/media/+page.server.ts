export const load = async ({ locals }) => {
	if (!locals.user) return { files: [] };

	// Query the database for all the media files associated with the user
	const userMedia = await locals.prisma.userMedia.findMany({
		where: {
			user: {
				id: locals.user.id
			}
		}
	});

	// Check if media is being used
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
	// TODO: This is a mess, fix it later (maybe)
	const imageUrls = userProjects.flatMap((project) => {
		return project.pages.flatMap((page) => {
			return (page as unknown as { data: { tiles: { image?: string }[] } }).data.tiles.flatMap(
				(tile) => {
					if (tile.image) return tile.image;
				}
			);
		});
	});

	const thumbnailUrls = userProjects.map((project) => {
		if (project.imageUrl) return project.imageUrl;
	});

	const mediaInUse = [...imageUrls, ...thumbnailUrls];

	// Create an array of file objects containing the file URL and any other metadata
	let files = userMedia.map((media) => ({
		url: media.url,
		createdAt: media.createdAt
	}));

	// Modify the files array to include .isInUse property
	files = files.map((file) => {
		if (mediaInUse.includes(file.url)) {
			return { ...file, isInUse: true };
		}
		return file;
	});

	return { files };
};
