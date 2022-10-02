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
	export let data: { projects: Array<Project>, theme: string };

	import { edit_user } from '$lib/api/user';

	let themeTextarea: HTMLTextAreaElement;

	// Handles making a new project
	const handle_project_creation = async () => {
		if(!$session?.access_token) return;
		// Create a new project
		const { project } = await create_project('new project', 'a brand new project!', $session.access_token);
		if(project) {
			data.projects.push(project);
			data = data; // Force update
		}
	};

	const handle_theme_change = async () => {
		if(!$session?.access_token) return;
		await edit_user({ theme: themeTextarea.value }, $session.access_token);
	};
</script>

<main>
	<SideBar />

	<div class="content">
		{#if $SelectedDashboardPage == DashboardPages.projects}
			<button on:click={handle_project_creation}
			>Add Project</button>
			{#each data.projects as project}
				<ProjectCard {project} />
			{/each}
		{/if}
		{#if $SelectedDashboardPage == DashboardPages.account}
			<h1>Account</h1>
		{/if}
		{#if $SelectedDashboardPage == DashboardPages.appearance}
			<textarea bind:this={themeTextarea} value={data.theme} on:change={handle_theme_change} />
			<button on:click={() => window.location.assign('/dashboard')} >Refresh</button>
		{/if}
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
