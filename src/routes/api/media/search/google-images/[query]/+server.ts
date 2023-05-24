import google from 'googlethis';

export const GET = async ({ params }) => {
	// Image Search
	const images = await google.image(params.query, { safe: true });
	const results = images.map((image) => ({
		image: image.url,
		thumbnail: image.preview.url,
		alt: image.origin.title
	}));

	return new Response(
		JSON.stringify(
			results
				.map((result) => {
					if (result.image.endsWith('.gif')) return;
					return result;
				})
				.filter((result) => result)
		),
		{
			headers: {
				'content-type': 'application/json;charset=UTF-8',
				'Access-Control-Allow-Origin': '*'
			}
		}
	);
};
