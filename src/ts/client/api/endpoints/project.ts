/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_API_URL } from '$env/static/public';
import type { OBFPage } from '$ts/common/openboardformat';
import type { Project, TilePageInProject } from '$ts/common/types';

const project = {
	view: viewProject,
	list: listProjects,
	create: createProject,
	delete: deleteProject,
	edit: editProject,
	viewPage: viewPageInProject,
	import: {
		obf: importObf,
		obz: importObz
	}
};

export default project;

async function listProjects(token?: string) {
	const response = await fetch(PUBLIC_API_URL + '/project/list', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token ? token : localStorage.getItem('token')}`
		}
	});
	const data = (await response.json()) as {
		projects: Project[];
	};
	return data;
}

async function createProject({
	name,
	columns,
	rows
}: {
	name: string;
	columns: number;
	rows: number;
}) {
	const response = await fetch(PUBLIC_API_URL + '/project/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name, columns, rows, isPublic: false, description: '' })
	});

	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function deleteProject(projectId: string) {
	const response = await fetch(`${PUBLIC_API_URL}/project/${projectId}/delete`, {
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

async function editProject(
	projectId: string,
	body: {
		name?: string;
		columns?: number;
		rows?: number;
		imageUrl?: string;
	}
) {
	const response = await fetch(`${PUBLIC_API_URL}/project/${projectId}/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(body)
	});

	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function viewProject(projectId: string, token?: string) {
	const response = await fetch(`${PUBLIC_API_URL}/project/${projectId}/view`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token ? token : localStorage.getItem('token')}`
		}
	});

	const data = (await response.json()) as {
		project: Project;
		error: string;
	};

	return data;
}

async function viewPageInProject(projectId: string, pageId: string, token?: string) {
	const response = await fetch(`${PUBLIC_API_URL}/project/${projectId}/view-page-in-project`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token ? token : localStorage.getItem('token')}`
		},
		body: JSON.stringify({ pageId })
	});

	const data = (await response.json()) as {
		page: TilePageInProject;
		error: string;
	};

	return data;
}

async function importObf(body: OBFPage) {
	const response = await fetch(`${PUBLIC_API_URL}project/import/obf`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(body)
	});

	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}

async function importObz(body: {
	manifest: any;
	obfFiles: (
		| {
				fileName: string;
				data: any;
		  }
		| undefined
	)[];
}) {
	const response = await fetch(`${PUBLIC_API_URL}project/import/obz`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(body)
	});

	const data = (await response.json()) as {
		success: boolean;
		error: string;
	};

	return data;
}
