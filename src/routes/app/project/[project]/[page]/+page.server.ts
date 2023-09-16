import { ELEVEN_LABS_KEY } from '$env/static/private';
import slugify from '$ts/common/slugify.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, locals, params }) => {
	if (!locals.user) throw redirect(302, '/login');

	const projects = await locals.prisma.project.findMany({
		where: {
			userId: locals.user.id
		},
		include: {
			pages: true
		}
	});

	const project = projects.find(
		(project) => slugify(project.name).toLowerCase() === params.project.toLowerCase()
	);

	if (!project) throw redirect(302, '/app/dashboard/projects');

	const page = project.pages.find(
		(page) => slugify(page.name).toLowerCase() === params.page.toLowerCase()
	);

	if (!page) throw redirect(302, '/app/dashboard/projects');

	const voicesData = await fetch('/api/v1/text-to-speech/elevenlabs/voices').then((res) =>
		res.json()
	);

	return {
		projects,
		project,
		page: page.name,
		elevenLabsVoices: voicesData.map((voice: { category: string; name: string }) => ({
			...voice,
			fsSlug: `[${voice.category}] ${voice.name}`
		})),
		elevenLabsApiKey: ELEVEN_LABS_KEY
	};
};
