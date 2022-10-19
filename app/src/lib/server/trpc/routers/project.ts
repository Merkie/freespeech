// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { User, Tile, TilePage, Project } from '@prisma/client';
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
			const project: Project = await prismaClient.project.create({
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
	.mutation('clone', {
		input: z.object({
			id: z.string(),
			index: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			// 1) Check if user is logged in
			const user = ctx.user;
			if (!user) {
				return {};
			}

			// 2) Get project
			const project = await prismaClient.project.findUnique({
				where: {
					id: input.id
				},
				include: {
					pages: {
						include: {
							tiles: true
						}
					}
				}
			});
			if (!project) return {};
			if (!project.public && project.userId !== user.id) return {};

			const newProject: Project = await prismaClient.project.create({
				data: {
					name: project.name + ' clone',
					description: project.description || '',
					columns: project.columns,
					image: project.image || '',
					index: 0,
					author: {
						connect: {
							id: user.id
						}
					}
				}
			});

			for (const page of project.pages) {
				const newPage: TilePage = await prismaClient.tilePage.create({
					data: {
						name: page.name,
						Project: {
							connect: {
								id: newProject.id
							}
						},
						user: {
							connect: {
								id: user.id
							}
						},
						tiles: {
							create: page.tiles.map((tile) => {
								return {
									tile_index: tile.tile_index,
									display_text: tile.display_text + '',
									speak_text: tile.speak_text || '',
									// links will need to be reworked for this
									image: tile.image || '',
									// so will navs
									navigation_page_id: tile.navigation_page_id || null,
									modifier: tile.modifier || '',
									conjugations: tile.conjugations || '',
									background_color: tile.background_color || '',
									border_color: tile.border_color || '',
									text_color: tile.text_color || '',
									is_silent: tile.is_silent || false,
									is_invisible: tile.is_invisible || false,
									is_accented: tile.is_accented || false,
									author: {
										connect: {
											id: user.id
										}
									}
								};
							})
						}
					}
				});
			}

			const whole_new_project = await prismaClient.project.findUnique({
				where: {
					id: newProject.id
				},
				include: {
					pages: {
						include: {
							tiles: true
						}
					}
				}
			});
			if (!whole_new_project) return {};

			// fix all the links and navigation refrences
			for (const page of whole_new_project.pages) {
				for (const tile of page.tiles) {
					if (tile.navigation_page_id) {
						const page_name = project.pages.find((p) => p.id === tile.navigation_page_id)?.name;
						const new_page = whole_new_project?.pages.find((p) => p.name === page_name);
						if (!new_page) continue;

						await prismaClient.tile.update({
							where: {
								id: tile.id
							},
							data: {
								navigation_page_id: new_page.id
							}
						});
					} else if (tile.link_id) {
						const all_tiles = project.pages.flatMap((p) => p.tiles);
						const old_link = all_tiles.find((t) => t.id === tile.link_id);
						const old_page = project.pages.find((p) => p.id === old_link?.navigation_page_id);
						const old_tile = old_page?.tiles.find((t) => t.tile_index === old_link?.tile_index);
						const new_page = whole_new_project?.pages.find((p) => p.name === old_page?.name);
						const new_tile = new_page?.tiles.find((t) => t.tile_index === old_tile?.tile_index);
						if (!new_tile) continue;

						await prismaClient.tile.update({
							where: {
								id: tile.id
							},
							data: {
								link_id: new_tile.id
							}
						});
					}
				}
			}
			if (!newProject) return {};
			return newProject;
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

			//@ts-ignore
			const all_tiles = project.pages.flatMap((p) => p.tiles);
			let nav_page_ids: number[] = [];

			for (const tile of all_tiles) {
				if (tile.navigation_page_id) {
					nav_page_ids = [...nav_page_ids, tile.navigation_page_id];
				}
			}

			if (project.userId === user.id) {
				// go through all pages, if unlinked delete it
				for (const page of project.pages) {
					if (!nav_page_ids.includes(page.id)) {
						await prismaClient.tilePage.delete({
							where: {
								id: page.id
							}
						});
					}
				}
			}

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
	})
	.mutation('delete', {
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
				}
			});
			if (!project) return null;

			// 3) Check if user is authorized to delete project
			if (project.userId !== user.id) return null;

			// 4) Delete project
			const deletedProject = await prismaClient.project.delete({
				where: {
					id: input
				}
			});

			// 5) Return project
			return deletedProject;
		}
	});
