import { json } from '@sveltejs/kit';

export const GET = async ({ fetch, url }) => {
	const params = url.searchParams;

	const responseJson = await fetch(
		'https://www.opensymbols.org/api/v1/symbols/search?q=' +
			encodeURIComponent(params.get('query') + ''),
		{
			headers: {
				Accept: 'application/json, text/javascript, */*; q=0.01',
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json; charset=UTF-8',
				Pragma: 'no-cache',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				'X-Requested-With': 'XMLHttpRequest'
			}
		}
	).then((response: Response) => response.json());

	return json({
		results: responseJson.map((item: { name: string; image_url: string }) => ({
			name: item.name,
			image_url: item.image_url
		}))
	});
};
