/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_API_URL } from '$env/static/public';

export async function fetchFromAPI({
	path,
	method,
	body,
	token,
	options
}: {
	path: string;
	method: 'GET' | 'POST' | 'DELETE';
	body?: any;
	token?: string;
	options?: {
		parseResponseJson?: boolean;
	};
}) {
	let headers: HeadersInit = {
		'Content-Type': 'application/json'
	};

	try {
		const authToken = (token ? token : localStorage.getItem('token')) + '';

		if (authToken) {
			headers = {
				...headers,
				Authorization: `Bearer ${authToken}`
			};
		}
	} catch {
		// do nothing
	}

	const response = await fetch(PUBLIC_API_URL + path, {
		method,
		headers,
		body: JSON.stringify(body)
	});

	if (options?.parseResponseJson === false) {
		return response;
	}

	const data = await response.json();
	return data;
}
