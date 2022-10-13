// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { User } from '@prisma/client';
import type { Context } from '../context';
import type { IMeta } from '../IMeta';

export default router<Context, IMeta>()
	.mutation('create', {
		input: z.object({
			name: z.string(),
			description: z.string(),
			index: z.number(),
			columns: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			// 1) Check if user is logged in
			const user = ctx.user;
			if (!user) {
				return {};
			}

			// 2) Create project
			const project = await prismaClient.project.create({
				data: {
					name: input.name,
					description: input.description,
					columns: input.columns,
					author: {
						connect: {
							id: user.id
						}
					},
					index: input.index,
					pages: {
						create: {
							name: 'Home',
							user: {
								connect: {
									id: user.id
								}
							},
							tiles: {
								create: {
									tile_index: 0,
									display_text: 'First tile!',
									author: {
										connect: {
											id: user.id
										}
									}
								}
							}
						}
					}
				}
			});

			// 3) Return project
			return project;
		}
	})
	.query('fetch', {
		input: z.string(),
		resolve: async ({ input, ctx }) => {
			// 1) Get user from context
			const user = ctx.user;
			if (!user) {
				return {};
			}

			// 2) Get project
			const project = await prismaClient.project.findUnique({
				where: {
					id: input
				},
				include: {
					pages: {
						include: {
							tiles: true
						}
					}
				}
			});
			if (!project) return null;

			// 3) Check if user is authorized to view project
			// Checking to see if the user is the author of the project
			// or if the project is public.
			if (project.userId === user.id || project.public) return project;
			return null;
		}
	})
	.query('explore', {
		resolve: async ({ ctx }) => {
			// return all public projects
			const projects = await prismaClient.project.findMany({
				where: {
					public: true
				},
				include: {
					author: true
				}
			});
			return projects;
		}
	})
	.mutation('edit', {
		input: z.object({
			id: z.string(),
			name: z.string().optional(),
			description: z.string().optional(),
			image: z.string().optional(),
			public: z.boolean().optional(),
			favorite: z.boolean().optional(),
			columns: z.number().optional()
		}),
		resolve: async ({ input, ctx }) => {
			// 1) Get user from context
			const user = ctx.user;
			if (!user) {
				return {};
			}

			// 2) Get project
			const project = await prismaClient.project.findUnique({
				where: {
					id: input.id
				}
			});
			if (!project) return null;

			// 3) Check if user is authorized to edit project
			if (project.userId !== user.id) return null;

			// 4) Edit project
			const editedProject = await prismaClient.project.update({
				where: {
					id: input.id
				},
				data: {
					name: input.name || project.name,
					description: input.description || project.description,
					image: input.image || project.image,
					public: input.public || project.public,
					columns: input.columns || project.columns
					// favorite: input.favorite || project.favorite
				}
			});

			// 5) Return project
			return editedProject;
		}
	})
	.query('search', {
		input: z.string(),
		resolve: async ({ input, ctx }) => {
			const projects = await prismaClient.project.findMany({
				where: {
					name: {
						search: input
					},
					description: {
						search: input
					},
					public: true
				},
				include: {
					author: true
				}
			});
			return projects;
		}
	});
