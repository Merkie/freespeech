<script lang="ts">
	import { Me, IsProjectCreationModalOpen } from '$lib/client/stores';
	import type { Project } from '@prisma/client';
	import CreateProjectModal from './CreateProjectModal.svelte';
	import ProjectCard from './ProjectCard.svelte';

	// Sort the projects by last updated
	let projects = $Me.projects.sort((a, b) => {
		return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
	});

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

	main {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}
</style>
