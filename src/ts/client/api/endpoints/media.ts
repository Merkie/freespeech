import { fetchFromAPI } from '../util';

const media = {
	fetchFromUrl,
	searchImages: {
		google: searchGoogleImages,
		openSymbols: searchOpenSymbols
	},
	presignUpload
};

export default media;

async function fetchFromUrl(url: string) {
	const response = await fetchFromAPI({
		path: `/media/fetch-from-url`,
		method: 'POST',
		body: { url },
		options: {
			parseResponseJson: false
		}
	});

	const blob = await response.blob();
	return blob;
}

async function searchGoogleImages(body: { query: string; skinColor: string }) {
	const response = (await fetchFromAPI({
		path: `/media/search/google?q=${encodeURIComponent(body.query)}&skin=${encodeURIComponent(body.skinColor)}`,
		method: 'GET'
	})) as {
		results: {
			alt: string;
			image_url: string;
			thumbnail_url: string;
		}[];
	};

	return response;
}

async function searchOpenSymbols(body: { query: string; skinColor: string }) {
	const response = (await fetchFromAPI({
		path: `/media/search/open-symbols?q=${encodeURIComponent(body.query)}&skin=${encodeURIComponent(body.skinColor)}`,
		method: 'GET'
	})) as {
		results: {
			alt: string;
			image_url: string;
			thumbnail_url: string;
		}[];
	};

	return response;
}

async function presignUpload(filename: string) {
	const response = (await fetchFromAPI({
		path: `/media/upload/presign`,
		method: 'POST',
		body: { filename }
	})) as {
		presignedUrl: string;
		key: string;
	};

	return response;
}
