import { PUBLIC_API_URL } from '$env/static/public';

const page = {
	edit: editPage,
	delete: deletePage,
	create: createPage
};

export default page;

async function deletePage(pageId: string) {
	const response = await fetch(`${PUBLIC_API_URL}/page/${pageId}/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});
	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function createPage(body: { name: string; projectId: string }) {
	const response = await fetch(`${PUBLIC_API_URL}/page/create`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function editPage(
	pageId: string,
	body: {
		name: string;
	}
) {
	await fetch(`${PUBLIC_API_URL}/page/${pageId}/update`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
}
