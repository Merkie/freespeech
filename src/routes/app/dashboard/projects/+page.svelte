<script lang="ts">
	import ProjectCard from '$components/dashboard/ProjectCard.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fade, fly, scale } from 'svelte/transition';
	export let data: PageData;

	let createProjectModalOpen = false;
	let containerHeight: number;

	onMount(() => {
		if (data.projects.length === 0) createProjectModalOpen = true;
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
<div bind:clientHeight={containerHeight} class="flex-1 mt-4 flex flex-col">
	{#if containerHeight}
		<div
			class="absolute p-2 w-full bg-zinc-900 rounded-md border border-zinc-700"
			style={`height: ${containerHeight}px; max-height: ${containerHeight}px; overflow-y: auto;`}
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-2">
				{#each data.projects as project, index}
					<div in:fly={{ delay: (index + 1) * 100, y: 10 }}>
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
