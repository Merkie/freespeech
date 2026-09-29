/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '$ts/client/api';

export const load = async ({ locals: { user }, cookies }) => {
	const [{ voices }, personalKey] = await Promise.all([
		api.tts.voices.elevenlabs(cookies.get('token')),
		api.user.getElevenLabsKey(cookies.get('token'))
	]);

	return {
		voices: voices || [],
		elevenLabsKeyIsSet: !!personalKey.isSet,
		elevenLabsKeyLast4: personalKey.last4 || '',
		usePersonalElevenLabsKey: user.usePersonalElevenLabsKey
	};
};
