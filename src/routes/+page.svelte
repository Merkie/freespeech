<script lang="ts">
	import Application from '$components/app/Application.svelte';
	import BottomNavigation from '$components/common/BottomNavigation.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { ActiveProject, AppMode } from '$ts/client/stores';
	import Dashboard from '$components/dashboard/Dashboard.svelte';
	import Loader from '$components/common/Loader.svelte';
	import { Loading } from '$ts/client/stores';
	export let data: PageData;

	onMount(async () => {
		if (data.projects.length === 0) {
			$AppMode = 'dashboard';
		} else {
			if (!$ActiveProject) {
				const project = await fetch(`/api/project/fetch/${data.projects[0].id}`);
				const projectData = await project.json();
				if (projectData.error) {
					return alert(projectData.error);
				}
				$ActiveProject = projectData.project;
			}
		}
	});
</script>

{#if $Loading}
	<Loader />
{/if}

<main class="h-screen flex flex-col">
	{#if ['home', 'edit'].includes($AppMode)}
		<Application />
	{/if}
	{#if $AppMode === 'dashboard'}
		<Dashboard projects={data.projects} />
	{/if}
	<BottomNavigation noProjects={data.projects.length === 0} />
</main>
