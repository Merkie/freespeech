import { PUBLIC_API_URL } from '$env/static/public';
import type { Tile } from '$ts/common/types';

const tile = {
	create: createTile,
	delete: deleteTile,
	edit: editTile
};

export default tile;

async function createTile(body: { x: number; y: number; page: number; pageId: string }) {
	await fetch(`${PUBLIC_API_URL}/tile/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(body)
	});
}

async function deleteTile(tileId: string) {
	const response = await fetch(`${PUBLIC_API_URL}/project/${tileId}/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});

	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function editTile(tileId: string, body: Tile) {
	const response = await fetch(`${PUBLIC_API_URL}/tile/${tileId}/edit`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};
	return data;
}
