import { fetchFromAPI } from '../util';

const media = {
	fetchFromUrl,
	searchImages: {
		google: searchGoogleImages,
		openSymbols: searchOpenSymbols
	},
	presignUpload,
	removeBackground
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
		path: `/media/search/brave?q=${encodeURIComponent(body.query)}&skin=${encodeURIComponent(body.skinColor)}`,
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

async function removeBackground(imageUrl: string) {
	const response = (await fetchFromAPI({
		path: `/media/remove-background`,
		method: 'POST',
		body: { image_url: imageUrl }
	})) as {
		image_url: string;
	};

	return response;
}
