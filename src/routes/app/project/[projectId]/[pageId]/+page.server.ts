import api from '$ts/client/api/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params: { projectId, pageId }, cookies }) => {
	const { page: projectPage } = await api.project.viewPage(projectId, pageId, cookies.get('token'));

	if (!projectPage || !projectPage.tilePage || !projectPage.project)
		throw redirect(302, '/app/dashboard/projects');

	return {
		page: projectPage.tilePage,
		project: projectPage.project,
		projectPages: projectPage.project.connectedPages!.map((p) => p.tilePage)
	};
};
