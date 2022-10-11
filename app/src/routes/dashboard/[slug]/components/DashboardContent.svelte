<script lang="ts">
	import { DashboardPage, DashboardPages } from '$lib/client/stores';
	import AccountPage from './AccountPage.svelte';
	import ProjectsPage from './ProjectsPage.svelte';
	import UploadsPage from './UploadsPage.svelte';
	import AdvancedPage from './AdvancedPage.svelte';
	import { page } from '$app/stores';
	$DashboardPage = $page.params.slug;
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
		margin-left: 220px;
		margin-top: 20px;
		flex: 1;
	}

	@media (max-width: 750px) {
		main {
			margin-left: 80px;
		}
	}
</style>
