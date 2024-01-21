<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import type { Project } from '@prisma/client';
	import { openModal } from '$ts/client/stores';
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import SearchBar from '$components/dashboard/SearchBar.svelte';

	export let data;

	let searchQuery = writable('');
	let searchedProjects: Project[] = [];

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

<SearchBar query={searchQuery}>
	<button
		on:click={() => ($openModal = { name: 'create-project' })}
		class="btn-sm btn-primary hidden sm:flex"
	>
		<i class="bi bi-plus-lg" />
		<span>Create New Project</span>
	</button>
	<button
		on:click={() => ($openModal = { name: 'manage-projects', props: { projects: data.projects } })}
		class="btn-sm btn-neutral hidden sm:flex"
	>
		<i class="bi bi-gear" />
		<span>Manage Projects</span>
	</button>
</SearchBar>

<div class="m-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each $searchQuery ? searchedProjects : data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {project} />
		</div>
	{/each}
</div>
