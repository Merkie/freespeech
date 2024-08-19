import { PUBLIC_API_URL } from '$env/static/public';

const user = {
	update: updateUser
};

export default user;

async function updateUser(body: {
	name?: string;
	profileImgUrl?: string;
	elevenLabsApiKey?: string;
	usePersonalElevenLabsKey?: boolean;
}) {
	const response = await fetch(PUBLIC_API_URL + '/user/update', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(body)
	});

	const json = (await response.json()) as {
		success: boolean;
	};

	return json;
}
