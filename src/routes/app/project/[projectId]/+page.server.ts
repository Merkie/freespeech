import api from '$ts/client/api/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params: { projectId }, cookies }) => {
	const { project } = await api.project.view(projectId, cookies.get('token'));
	if (!project) throw redirect(307, '/app/dashboard');

	const homePage = project.connectedPages!.find(
		({ tilePage }) => tilePage!.name.toLowerCase().trim() === 'home'
	);

	if (!homePage)
		throw redirect(307, `/app/project/${projectId}/${project.connectedPages![0].tilePageId}`);

	throw redirect(307, `/app/project/${projectId}/${homePage.tilePageId}`);
};
