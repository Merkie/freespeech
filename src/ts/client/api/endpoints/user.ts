import { fetchFromAPI } from '../util';

const user = {
	update: updateUser,
	getElevenLabsKey,
	exportData,
	deleteAccount
};

export default user;

async function updateUser(body: {
	name?: string;
	profileImgUrl?: string;
	/** A new key to save, or null to remove the saved one. */
	elevenLabsApiKey?: string | null;
	usePersonalElevenLabsKey?: boolean;
}) {
	const response = (await fetchFromAPI({
		path: '/user/update',
		method: 'POST',
		body
	})) as {
		success: boolean;
	};

	return response;
}

async function getElevenLabsKey(token?: string) {
	const response = (await fetchFromAPI({
		path: '/user/get-eleven-labs-key',
		method: 'GET',
		token
	})) as {
		isSet: boolean;
		last4: string;
		error: string;
	};

	return response;
}

async function exportData() {
	const response = (await fetchFromAPI({
		path: '/user/export',
		method: 'GET',
		options: { parseResponseJson: false }
	})) as Response;

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.error || 'Could not download your data.');
	}

	return response.blob();
}

async function deleteAccount(body: { password?: string; email?: string }) {
	const response = (await fetchFromAPI({
		path: '/user/delete',
		method: 'POST',
		body
	})) as {
		success?: boolean;
		error?: string;
	};

	return response;
}
