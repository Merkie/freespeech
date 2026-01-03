import api from '$ts/client/api/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params: { projectId }, cookies }) => {
	const { project } = await api.project.view(projectId, cookies.get('token'));
	if (!project) throw redirect(307, '/app/dashboard');

	// Use cached homePageId (backfilled by backend if missing)
	if (project.homePageId) {
		throw redirect(307, `/app/project/${projectId}/${project.homePageId}`);
	}

	// Fallback for edge cases (shouldn't happen after backfill)
	const homePage = project.connectedPages?.find(
		({ tilePage }) => tilePage?.name.toLowerCase().trim() === 'home'
	);
	const pageId = homePage?.tilePageId || project.connectedPages?.[0]?.tilePageId;

	if (!pageId) throw redirect(307, '/app/dashboard');

	throw redirect(307, `/app/project/${projectId}/${pageId}`);
};
