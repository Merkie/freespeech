import { image_search } from 'duckduckgo-images-api';

export const GET = async ({ params }) => {
	const results = await image_search({ query: params.query, moderate: true });

	return new Response(
		JSON.stringify(
			results
				.map((result) => {
					if (result.image.endsWith('.gif')) return;
					return {
						image: result.image,
						thumbnail: result.thumbnail,
						alt: result.title
					};
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
