import { json } from '@sveltejs/kit';
import google from 'googlethis';

export const GET = async ({ params }) => {
	// Image Search
	const images = await google.image(params.query, { safe: true });
	const results = images.map((image) => ({
		image: image.url,
		thumbnail: image.preview.url,
		alt: image.origin.title
	}));

	// Filter out gifs
	const imageUrls = results
		.map((result) => {
			if (result.image.endsWith('.gif')) return;
			return result;
		})
		.filter((result) => result);

	// Return image urls
	return json(imageUrls);
};
