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
	<CreateProjectModal form={data.createProjectForm} />
{/if}

<SearchBar query={searchQuery}>
	<button
		on:click={() => ($openModal = { name: 'create-project' })}
		class="bg-blue-600 px-2 sm:block hidden p-1 border border-blue-500 rounded-md text-blue-50 text-sm"
		><i class="bi bi-plus-lg" /> Create New Project</button
	>
	<button
		on:click={() => (editModeOn = !editModeOn)}
		class="bg-zinc-700 px-2 sm:block hidden p-1 border border-zinc-600 rounded-md text-zinc-50 text-sm"
		><i class="bi bi-gear" /> Manage Projects</button
	>
	<button disabled={true} class="text-xl">
		<i class="bi bi-three-dots" />
	</button>
</SearchBar>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 m-2">
	{#each $searchQuery ? searchedProjects : data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {editModeOn} {project} />
		</div>
	{/each}
</div>
