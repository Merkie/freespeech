<script lang="ts">
	import { run } from 'svelte/legacy';

	import ProjectCard from '~/routes/app/dashboard/projects/_components/ProjectCard.svelte';
	import CreateProjectModal from './_components/CreateProjectModal/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Project } from '$ts/common/types';
	import Fuse from 'fuse.js';
	import { AddingProject, EditingProjects, LocalSettings } from '$ts/client/stores';
	import SearchBar from '~/routes/app/dashboard/projects/_components/SearchBar.svelte';
	import { writable } from 'svelte/store';
	import EditProjectsModal from '$components/modals/EditProjectsModal.svelte';
	import EditProjectModal from '$components/modals/EditProjectModal.svelte';

	let { data } = $props();

	let searchQuery = writable('');
	let searchedProjects: Project[] = $state([]);

	onMount(() => {
		// Open the create project modal if there are no projects
		if (data.projects.length === 0) $AddingProject = true;
	});

	run(() => {
		if (searchQuery) {
			const fuse = new Fuse(data.projects, {
				keys: ['name', 'description']
			});
			searchedProjects = fuse.search($searchQuery).map((result) => result.item);
		}
	});
</script>

<SearchBar query={searchQuery}>
	<button
		onclick={() => ($AddingProject = true)}
		class="hidden rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-sm text-blue-50 sm:block"
		><i class="bi bi-plus-lg"></i> Create New Project</button
	>
	<button
		onclick={() => ($EditingProjects = true)}
		class="hidden rounded-md border border-zinc-600 bg-zinc-700 p-2 px-4 text-sm text-zinc-50 sm:block"
		><i class="bi bi-gear"></i> Manage Projects</button
	>
</SearchBar>
<div class="m-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
	{#each ($searchQuery ? searchedProjects : data.projects).sort((a, b) => {
		if (a.id === $LocalSettings.lastVisitedProjectId) return -1;
		if (b.id === $LocalSettings.lastVisitedProjectId) return 1;
		return 0;
	}) as project, index (project.id)}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {project} />
		</div>
	{/each}
</div>

<CreateProjectModal />
<EditProjectsModal projects={data.projects} />
<EditProjectModal />
