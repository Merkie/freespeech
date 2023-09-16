import { ELEVEN_LABS_KEY, SITE_SECRET } from '$env/static/private';
import slugify from '$ts/common/slugify.js';
import { redirect } from '@sveltejs/kit';
import Cryptr from 'cryptr';

export const load = async ({ fetch, locals: { prisma, user }, params }) => {
	if (!user) throw redirect(302, '/login');

	const projects = await prisma.project.findMany({
		where: {
			userId: user.id
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

	let elevenLabsApiKey = ELEVEN_LABS_KEY;
	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elevenLabsApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	return {
		projects,
		project,
		page: page.name,
		elevenLabsVoices: voicesData,
		elevenLabsApiKey
	};
};
