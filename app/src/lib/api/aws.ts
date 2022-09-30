import { post } from './api.lib';

// Converting blob to base64 string
// This is done so we can send it to amazon using http
// safe characters.
const blobToBase64 = (blob: Blob) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			resolve(reader.result);
		};
	});
};

export const create_object = async (file: File) => {
	var reader = new FileReader(); // Make reader
	reader.readAsArrayBuffer(file); // Read file as array buffer

	// wait for reader to be done
	await new Promise<void>((resolve) => {
		reader.onload = () => {
			resolve();
		};
	});

	const blob = new Blob([reader.result || '']); // Convert to blob
	const base64 = await blobToBase64(blob); // Convert to base64

	// Return response
	return post('/api/aws/upload', {
		content: JSON.stringify({ blob: base64 }),
		filename: `${Date.now()}.${file.name.split('.').pop()}`
	});
};
