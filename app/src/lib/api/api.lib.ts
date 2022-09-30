// Post function
export const post = async (url: string, body: object, access_token = 'none') => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return await response.json();
};

// get function
export const get = async (url: string, access_token = 'none') => {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'application/json'
		}
	});

	return (await response.json()).message;
};
