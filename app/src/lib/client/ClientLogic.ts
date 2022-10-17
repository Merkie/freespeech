import { AppProject } from './stores';

// ClientLogic.ts
// This is the main logic for the client side of the app.

// - blobToBase64 -
// Takes a file blob as input and returns a promise that resolves
// to a string containing a base64 url encoded version of the file.
// This function is used for all image uploding functionalities in the app.
export const blobToBase64 = (blob: Blob): Promise<string | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			resolve(reader.result as string);
		};
	});
};

// - isEmail -
// Takes a string as input and returns a boolean indicating whether
// the string is a valid email address.
// This function is used in the login and signup forms.
export const isEmail = (string: string): boolean => {
	if (string.length > 320) return false;
	var matcher =
		/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return matcher.test(string);
};
