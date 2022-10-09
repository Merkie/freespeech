<script lang="ts">
	import { DashboardPage, DashboardPages } from '$lib/client/stores';
	import AccountPage from './AccountPage.svelte';
	import ProjectsPage from './ProjectsPage.svelte';
	import UploadsPage from './UploadsPage.svelte';
	import AdvancedPage from './AdvancedPage.svelte';
</script>

<main>
	{#if $DashboardPage === DashboardPages.account}
		<AccountPage />
	{/if}
	{#if $DashboardPage === DashboardPages.projects}
		<ProjectsPage />
	{/if}
	{#if $DashboardPage === DashboardPages.uploads}
		<UploadsPage />
	{/if}
	{#if $DashboardPage === DashboardPages.advanced}
		<AdvancedPage />
	{/if}
</main>

<style>
	main {
		position: relative;
		width: 100px;
		margin-top: 20px;
		flex: 1;
	}
</style>
