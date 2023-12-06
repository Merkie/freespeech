import { BING_IMAGE_SEARCH_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const query = url.searchParams.get('q');
	if (!query) return json({ results: [] });

	const response = await fetch(
		`https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(query)}`,
		{
			headers: {
				'Ocp-Apim-Subscription-Key': BING_IMAGE_SEARCH_KEY
			}
		}
	).catch((error: Error) => {
		console.error(error);
		return null;
	});

	if (!response || !response.ok) return json({ results: [] });

	const respJson = (await response.json().catch((error: Error) => {
		console.error(error);
		return null;
	})) as {
		value: {
			name: string;
			contentUrl: string;
			thumbnailUrl: string;
		}[];
	} | null;

	if (!respJson) return json({ results: [] });

	const results = respJson.value.map((result) => ({
		alt: result.name,
		image_url: result.contentUrl,
		thumbnail_url: result.thumbnailUrl
	}));

	return json({ results });
};
