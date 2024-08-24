import { fetchFromAPI } from '../util';

const user = {
	update: updateUser,
	getElevenLabsKey
};

export default user;

async function updateUser(body: {
	name?: string;
	profileImgUrl?: string;
	elevenLabsApiKey?: string;
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
		key: string;
		error: string;
	};

	return response;
}
