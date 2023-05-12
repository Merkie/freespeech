<script lang="ts">
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	export let data: PageData;

	let createProjectModalOpen = false;

	onMount(() => {
		if (data.projects.length === 0) createProjectModalOpen = true;
	});
</script>

{#if createProjectModalOpen}
	<CreateProjectModal closeModal={() => (createProjectModalOpen = false)} />
{/if}

<div class="p-2">
	<button
		on:click={() => (createProjectModalOpen = true)}
		class="bg-blue-600 px-2 p-1 border border-blue-500 rounded-md text-blue-50 text-sm"
		>Create New Project</button
	>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-2 m-2">
	{#each data.projects as project, index}
		<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
			<ProjectCard {project} />
		</div>
	{/each}
</div>
