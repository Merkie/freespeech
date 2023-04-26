<script lang="ts">
	import DashboardHeader from './DashboardHeader.svelte';
	import CreateProjectModal from '$components/modals/CreateProjectModal.svelte';
	import type { Project } from '@prisma/client';
	import { ActiveProject } from '$ts/client/stores';
	import ProjectCard from './ProjectCard.svelte';
	export let projects: Project[];

	let createProjectModalOpen = false;
</script>

{#if createProjectModalOpen}
	<CreateProjectModal closeModal={() => (createProjectModalOpen = false)} />
{/if}

<DashboardHeader />
<div class="flex-1 flex flex-col bg-zinc-800 p-2 font-light text-zinc-100">
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
		<div
			class={`flex-1 bg-zinc-900 rounded-md grid p-2 gap-2 ${
				projects.length === 0
					? 'place-items-center'
					: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 grid-rows-4 gap-2'
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
