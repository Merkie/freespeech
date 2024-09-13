import type { MarketPlaceTilePage } from '$ts/common/types';
import { fetchFromAPI } from '../util';

const marketplace = {
	uploadPage,
	listMarketplacePages
};

export default marketplace;

async function uploadPage(tilePageId: string, description?: string) {
	const response = (await fetchFromAPI({
		path: `/marketplace/upload-page`,
		method: 'POST',
		body: {
			tilePageId,
			description
		}
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}

async function listMarketplacePages() {
	const response = (await fetchFromAPI({
		path: `/marketplace/list`,
		method: 'GET'
	})) as {
		success: boolean;
		error: string;
		pages: MarketPlaceTilePage[];
	};

	return response;
}
