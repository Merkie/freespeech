<script lang="ts">
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import type { Project } from '@prisma/client';
	import Fuse from 'fuse.js';
	export let data: PageData;

	let createProjectModalOpen = false;
	let searchQuery = '';
	let searchedProjects: Project[] = [];

	onMount(() => {
		if (data.projects.length === 0) createProjectModalOpen = true;
	});

	$: {
		if (searchQuery) {
			const fuse = new Fuse(data.projects, {
				keys: ['name', 'description']
			});
			searchedProjects = fuse.search(searchQuery).map((result) => result.item);
		}
	}
</script>

{#if createProjectModalOpen}
	<CreateProjectModal closeModal={() => (createProjectModalOpen = false)} />
{/if}

<div class="p-2 pt-0 flex items-center gap-2">
	<div
		class="px-2 p-1 text-sm border bg-zinc-800 border-zinc-700 flex-1 rounded-md items-center flex gap-2"
	>
		<i class="bi bi-search" />
		<input
			bind:value={searchQuery}
			placeholder="Search projects..."
			type="text"
			class="flex-1 outline-none bg-transparent"
		/>
	</div>
	<button
		on:click={() => (createProjectModalOpen = true)}
		class="bg-blue-600 px-2 sm:block hidden p-1 border border-blue-500 rounded-md text-blue-50 text-sm"
		><i class="bi bi-plus-lg" /> Create New Project</button
	>
	<button
		disabled={true}
		class="bg-zinc-700 px-2 sm:block hidden p-1 border border-zinc-600 rounded-md text-zinc-50 text-sm"
		><i class="bi bi-gear" /> Manage Projects</button
	>
	<button disabled={true} class="p-2 text-xl">
		<i class="bi bi-three-dots" />
	</button>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-2 m-2">
	{#each searchQuery ? searchedProjects : data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {project} />
		</div>
	{/each}
</div>
