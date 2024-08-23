import { PUBLIC_API_URL } from '$env/static/public';
import type { Project } from '$ts/common/types';

const project = {
	list: listProjects,
	create: createProject,
	delete: deleteProject
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
