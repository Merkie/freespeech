<script lang="ts">
	import DashboardHeader from './DashboardHeader.svelte';
	import type { Project } from '@prisma/client';
	import ProjectsPage from './ProjectsPage.svelte';
	import { ActiveDashboardPage } from '$ts/client/stores';
	import UploadedMediaPage from './UploadedMediaPage.svelte';
	export let projects: Project[];
</script>

<DashboardHeader />
<div class="flex-1 flex flex-col bg-zinc-800 p-2 font-light text-zinc-100">
	{#if $ActiveDashboardPage === 'projects'}
		<ProjectsPage {projects} />
	{/if}
	{#if $ActiveDashboardPage === 'uploaded-media'}
		<UploadedMediaPage />
	{/if}
</div>
