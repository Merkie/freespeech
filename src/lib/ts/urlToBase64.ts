export default async (url: string) => {
	const response = await fetch(url);
	const blob = await response.blob();
	const reader = new FileReader();
	const base64Promise = new Promise((resolve, reject) => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
	});
	reader.readAsDataURL(blob);
	return base64Promise;
};
