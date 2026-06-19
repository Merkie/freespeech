import { fetchFromAPI } from '../util';
import type { Tile } from '$ts/common/types';

const tile = {
	create: createTile,
	delete: deleteTile,
	edit: editTile
};

export default tile;

async function createTile(body: { x: number; y: number; page: number; pageId: string }) {
	const response = (await fetchFromAPI({
		path: '/tile/create',
		method: 'POST',
		body
	})) as {
		tile?: Tile;
		error?: string;
	};

	return response.tile ?? null;
}

async function deleteTile(tileId: string) {
	const response = (await fetchFromAPI({
		path: `/tile/${tileId}/delete`,
		method: 'DELETE'
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}

async function editTile(tileId: string, body: Tile) {
	const response = (await fetchFromAPI({
		path: `/tile/${tileId}/edit`,
		method: 'POST',
		body
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}
