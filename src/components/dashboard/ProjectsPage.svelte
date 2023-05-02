<script lang="ts">
	import type { Project } from '@prisma/client';
	import ProjectCard from './ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	export let projects: Project[] = [];

	let createProjectModalOpen = false;

	onMount(() => {
		if (projects.length === 0) createProjectModalOpen = true;
	});
</script>

{#if createProjectModalOpen}
	<CreateProjectModal closeModal={() => (createProjectModalOpen = false)} />
{/if}

<div class="flex items-center">
	<p class="text-3xl">Projects:</p>
	<div class="flex-1" />
	<button
		on:click={() => (createProjectModalOpen = true)}
		class="bg-blue-600 px-2 p-1 border border-blue-500 rounded-md text-blue-50 text-sm"
		>Create New Project</button
	>
</div>
<div class="flex-1 pt-4 flex flex-col">
	<div class="overflow-auto h-full bg-zinc-900 rounded-md">
		<div
			class={`flex-1 grid p-2 gap-2 ${
				projects.length === 0
					? 'place-items-center'
					: 'grid-cols-2 md:grid-cols-3 grid-rows-2 gap-2'
			}`}
		>
			{#if projects.length === 0}
				<p class="text-zinc-500 text-[1vw]">Nothing here yet!</p>
			{:else}
				{#each projects as project}
					<ProjectCard {project} />
				{/each}
			{/if}
		</div>
	</div>
</div>
