import { json } from '@sveltejs/kit';
import google from 'googlethis';

export const GET = async ({ url }) => {
	const params = url.searchParams;

	// Image Search
	const images = await google.image(params.get('query') + '', { safe: true });
	const results = images.map((image) => ({
		image: image.url,
		thumbnail: image.preview.url,
		alt: image.origin.title
	}));

	// Filter out gifs
	const imageUrls = results
		.map((result) => {
			if (result.image.endsWith('.gif')) return;
			return {
				name: result.alt,
				image_url: result.image,
				thumbnail_url: result.thumbnail
			};
		})
		.filter((result) => result);

	// Return image urls
	return json({ results: imageUrls });
};
