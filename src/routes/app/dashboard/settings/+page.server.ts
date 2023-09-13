export const load = async ({ fetch }) => {
	return {
		elevenLabsVoices: await fetch('/api/v1/text-to-speech/elevenlabs/voices').then((res) =>
			res.json()
		)
	};
};
