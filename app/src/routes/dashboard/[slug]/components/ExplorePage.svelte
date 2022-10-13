<script lang="ts">
	//@ts-nocheck
	import trpc from '$lib/client/trpc';
	import type { Project } from '@prisma/client';
	import ProjectCard from './ProjectCard.svelte';
	import { onMount } from 'svelte';
	import Spinner from '$lib/client/components/Spinner.svelte';
	import { init } from 'svelte/internal';

	let loading = true;
	let projects: Project[] = [];
	let inital_projects;

	onMount(async () => {
		projects = await trpc(fetch).query('project:explore');
		inital_projects = projects;
		loading = false;
	});

	const handle_search = async (e) => {
		loading = true;
		if (e.target.value.trim().length == 0) {
			projects = inital_projects;
			loading = false;
			return;
		}
		projects = await trpc(fetch).query('project:search', e.target.value);
		loading = false;
	};
</script>

<span class="header"
	><h1>Explore</h1>
	<input on:input={handle_search} type="text" placeholder="Search..." /></span
>
<main>
	{#if loading}
		<div class="spinner"><Spinner /></div>
	{/if}
	{#each projects as project}
		<ProjectCard explore={true} {project} />
	{/each}
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		margin-bottom: 20px;
		gap: 20px;
	}

	.header input {
		flex: 1;
	}

	main {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.spinner {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 200px;
	}
</style>
