import api from './api';

export async function uploadFile(file: File) {
	const presignResponse = await api.media.presignUpload(file.name);

	const uploadResponse = await fetch(presignResponse.presignedUrl, {
		method: 'PUT',
		body: file
	});

	if (uploadResponse.status === 200) {
		return presignResponse.key;
	}

	return undefined;
}

export async function uploadBlob(filename: string, blob: Blob) {
	const file = new File([blob], filename, { type: blob.type });
	return uploadFile(file);
}
