<script lang="ts">
	// Types
	import { DashboardPages } from '$lib/types';
	import type { Project } from '@prisma/client';

	// Props
	export let data: { projects: Array<Project>; theme: string };

	// Components
	import SideBar from './components/SideBar.svelte';
	import ProjectCard from './components/ProjectCard.svelte';
	import TopBar from './components/TopBar.svelte';

	// Stores
	import { SelectedDashboardPage } from '$lib/stores';

	// API
	import { create_project } from '$lib/api/app';
	import { edit_user } from '$lib/api/user';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();

	// Bindings
	let themeTextarea: HTMLTextAreaElement;

	// Handles making a new project
	const handle_project_creation = async () => {
		if (!$session?.access_token) return;
		// Create a new project
		const { project } = await create_project(
			'new project',
			'a brand new project!',
			$session.access_token
		);
		if (project) {
			data.projects.push(project);
			data = data; // Force update
		}
	};

	// Handles changing the theme from the settings menu
	const handle_theme_change = async () => {
		if (!$session?.access_token) return;
		await edit_user({ theme: themeTextarea.value }, $session.access_token);
	};
</script>

<main>
	<SideBar />

	<div class="content">
		{#if $SelectedDashboardPage == DashboardPages.projects}
			<h1>Projects</h1>

			{#each data.projects as project}
				<ProjectCard {project} />
			{/each}
			<button class="new-project" on:click={handle_project_creation}>Create New Project</button>
		{/if}
		{#if $SelectedDashboardPage == DashboardPages.account}
			<h1>Account</h1>
		{/if}
		{#if $SelectedDashboardPage == DashboardPages.appearance}
			<h1>Appearance</h1>
			<textarea bind:this={themeTextarea} value={data.theme} on:change={handle_theme_change} />
			<button on:click={() => window.location.assign('/dashboard')}>Refresh</button>
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

	h1 {
		margin-top: 20px;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.new-project {
		background-color: var(--success);
		border: 1px solid var(--success-border);
		color: var(--text);
		border: none;
		padding: 10px;
		border-radius: 5px;
		margin-left: 10px;
		margin-top: 10px;
		width: calc(100% - 30px);
	}
</style>
