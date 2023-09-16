<script lang="ts">
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import type { Project } from '@prisma/client';
	import Fuse from 'fuse.js';
	import { openModal } from '$ts/client/stores';
	import SearchBar from '$components/dashboard/SearchBar.svelte';
	import { writable } from 'svelte/store';
	import ManageProjectsModal from '$components/modals/ManageProjectsModal.svelte';
	export let data: PageData;

	let searchQuery = writable('');
	let searchedProjects: Project[] = [];
	let editModeOn = false;

	onMount(() => {
		// Open the create project modal if there are no projects
		if (data.projects.length === 0) $openModal = { name: 'create-project' };
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

{#if $openModal.name === 'create-project'}
	<CreateProjectModal />
{/if}

{#if $openModal.name === 'manage-projects'}
	<ManageProjectsModal />
{/if}

<SearchBar query={searchQuery}>
	<button
		on:click={() => ($openModal = { name: 'create-project' })}
		class="hidden rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-sm text-blue-50 sm:block"
		><i class="bi bi-plus-lg" /> Create New Project</button
	>
	<button
		on:click={() => ($openModal = { name: 'manage-projects', props: { projects: data.projects } })}
		class="hidden rounded-md border border-zinc-600 bg-zinc-700 p-2 px-4 text-sm text-zinc-50 sm:block"
		><i class="bi bi-gear" /> Manage Projects</button
	>
</SearchBar>
<div class="m-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each $searchQuery ? searchedProjects : data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {editModeOn} {project} />
		</div>
	{/each}
</div>
