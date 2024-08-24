import { fetchFromAPI } from '../util';

const page = {
	edit: editPage,
	delete: deletePage,
	create: createPage
};

export default page;

async function deletePage(pageId: string) {
	const response = (await fetchFromAPI({
		path: `/page/${pageId}/delete`,
		method: 'DELETE'
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}

async function createPage(body: { name: string; projectId: string }) {
	const response = (await fetchFromAPI({
		path: '/page/create',
		method: 'POST',
		body
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}

async function editPage(
	pageId: string,
	body: {
		name: string;
	}
) {
	const response = (await fetchFromAPI({
		path: `/page/${pageId}/update`,
		method: 'POST',
		body
	})) as {
		success: boolean;
		error: string;
	};

	return response;
}
