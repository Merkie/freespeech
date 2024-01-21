export const load = async ({ locals }) => {
	// get all user projects, sort by most recent
	const projects = await locals.prisma.project.findMany({
		where: {
			userId: locals.user.id
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { projects };
};
