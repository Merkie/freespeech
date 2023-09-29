import { BRIGHTDATA_SERP_USERNAME, BRIGHTDATA_SERP_PASSWORD } from '$env/static/private';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export const GET = async ({ url }) => {
	const params = url.searchParams;

	const response = await axios.get(
		`https://www.google.com/search?q=${encodeURIComponent(
			params.get('query') + ''
		)}&tbm=isch&gl=us&brd_json=1`,

		{
			headers: {
				Accept: 'application/json'
			},
			proxy: {
				protocol: 'http',
				host: 'brd.superproxy.io',
				port: 22225,
				auth: {
					username: BRIGHTDATA_SERP_USERNAME,
					password: BRIGHTDATA_SERP_PASSWORD
				}
			}
		}
	);

	// Return image urls
	return json({
		results: response.data.images.map(
			(result: { title: string; image: string; thumbnail: string }) => ({
				name: result.title,
				image_url: result.image
			})
		)
	});
};
