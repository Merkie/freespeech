<script lang="ts">
	import { Me, IsProjectCreationModalOpen } from '$lib/client/stores';
	import type { Project } from '@prisma/client';
	import CreateProjectModal from './CreateProjectModal.svelte';
	import ProjectCard from './ProjectCard.svelte';

	let projects = $Me.projects;

	const open_project_creation_modal = () => {
		$IsProjectCreationModalOpen = true;
	};

	const add_project = (project: Project) => {
		// @ts-ignore
		projects = [project, ...projects];
	};
</script>

<span class="header"
	><h1>Projects</h1>
	<button on:click={open_project_creation_modal}>Create new project</button></span
>
<CreateProjectModal {add_project} />
<main>
	{#each projects as project}
		<!-- <div>
		<b>{project.name}</b>
		<button on:click={() => window.location.assign(`/app/${project.id}`)}>Visit</button>
	</div> -->
		<ProjectCard {project} />
	{/each}
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	div {
		display: flex;
		align-items: center;
		gap: 20px;
		background-color: var(--base-100);
		padding: 20px;
		border-radius: 10px;
		border: 1px solid var(--base-400);
		filter: var(--shadow);
		margin-bottom: 20px;
		width: auto;
	}

	main {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}
</style>
