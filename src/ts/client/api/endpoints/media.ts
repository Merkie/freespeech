import { PUBLIC_API_URL } from '$env/static/public';

const media = {
	fetchFromUrl,
	searchImages: {
		bing: searchBingImages,
		openSymbols: searchOpenSymbols
	}
};

export default media;

async function fetchFromUrl(url: string) {
	const response = await fetch(PUBLIC_API_URL + `/media/fetch-from-url`, {
		method: 'POST',
		body: JSON.stringify({
			url
		}),
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
			'Content-Type': 'application/json'
		}
	});

	const blob = await response.blob();

	return blob;
}

async function searchBingImages(body: { query: string; skinColor: string }) {
	const response = await fetch(
		PUBLIC_API_URL +
			`/media/search/bing?q=${encodeURIComponent(body.query)}&skin=${encodeURIComponent(body.skinColor)}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		}
	);

	const json = (await response.json()) as {
		results: {
			alt: string;
			image_url: string;
			thumbnail_url: string;
		}[];
	};

	return json;
}

async function searchOpenSymbols(body: { query: string; skinColor: string }) {
	const response = await fetch(
		PUBLIC_API_URL +
			`/media/search/open-symbols?q=${encodeURIComponent(body.query)}&skin=${encodeURIComponent(body.skinColor)}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		}
	);

	const json = (await response.json()) as {
		results: {
			alt: string;
			image_url: string;
			thumbnail_url: string;
		}[];
	};

	return json;
}
