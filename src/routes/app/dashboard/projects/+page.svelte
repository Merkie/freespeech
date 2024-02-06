<script lang="ts">
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Project } from '@prisma/client';
	import Fuse from 'fuse.js';
	import { AddingProject, EditingProjects } from '$ts/client/stores';
	import SearchBar from '$components/dashboard/SearchBar.svelte';
	import { writable } from 'svelte/store';
	import EditProjectsModal from '$components/modals/EditProjectsModal.svelte';
	import EditProjectModal from '$components/modals/EditProjectModal.svelte';

	export let data;

	let searchQuery = writable('');
	let searchedProjects: Project[] = [];
	let editModeOn = false;

	onMount(() => {
		// Open the create project modal if there are no projects
		if (data.projects.length === 0) $AddingProject = true;
	});

	$: {
		if (searchQuery) {
			const fuse = new Fuse(data.projects, {
				keys: ['name', 'description']
			});
			searchedProjects = fuse.search($searchQuery).map((result) => result.item);
		}
	}
</script>

<CreateProjectModal />

<EditProjectsModal projects={data.projects} />

<EditProjectModal />

<SearchBar query={searchQuery}>
	<button
		on:click={() => ($AddingProject = true)}
		class="hidden rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-sm text-blue-50 sm:block"
		><i class="bi bi-plus-lg" /> Create New Project</button
	>
	<button
		on:click={() => ($EditingProjects = true)}
		class="hidden rounded-md border border-zinc-600 bg-zinc-700 p-2 px-4 text-sm text-zinc-50 sm:block"
		><i class="bi bi-gear" /> Manage Projects</button
	>
</SearchBar>
<div class="m-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each $searchQuery ? searchedProjects : data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {project} />
		</div>
	{/each}
</div>
