import azure from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';
import { Buffer } from 'buffer';

export default async (text: string, voice: string, style: string) => {
	return new Promise((resolve, reject) => {
		const speechConfig = azure.SpeechConfig.fromSubscription(
			process.env.AZURE_SPEECH_KEY + '',
			process.env.AZURE_SPEECH_REGION + ''
		);
		speechConfig.speechSynthesisOutputFormat = 5; // mp3

		const synthesizer = new azure.SpeechSynthesizer(speechConfig);

		const ssml = `
		<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
		xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
			<voice name="${voice}">
					<mstts:express-as style="${style}">
							${text}
					</mstts:express-as>
			</voice>
		</speak>`;

		synthesizer.speakSsmlAsync(
			ssml,
			(result) => {
				const { audioData } = result;

				synthesizer.close();
				// return stream from memory
				const bufferStream = new PassThrough();
				bufferStream.end(Buffer.from(audioData));
				resolve('data:audio/mpeg;base64,' + bufferStream.read().toString('base64'));
			},
			(error) => {
				synthesizer.close();
				reject(error);
			}
		);
	});
};
