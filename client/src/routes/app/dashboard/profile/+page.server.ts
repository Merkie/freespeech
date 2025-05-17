import api from '$ts/client/api';

export const load = async ({ cookies }) => {
	const { key } = await api.user.getElevenLabsKey(cookies.get('token'));

	return { elevenLabsApiKey: key + '' };
};
