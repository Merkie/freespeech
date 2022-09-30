<script lang="ts">
	import SideBar from './components/SideBar.svelte';
	import TopBar from './components/TopBar.svelte';
	import ProjectCard from './components/ProjectCard.svelte';
	import { DashboardPages } from '$lib/types';
	import { SelectedDashboardPage } from '$lib/stores';
	import { create_project } from '$lib/api/app';
	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();
	import type { Project } from '@prisma/client';
	export let data: { projects: Array<Project> };
</script>

<main>
	<SideBar />

	<div class="content">
		<button
			on:click={() => create_project('new project', 'a brand new project!', $session.access_token)}
			>Add Project</button
		>
		{#each data.projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</main>

<style>
	main {
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: var(--background);
		display: flex;
		gap: 10px;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
