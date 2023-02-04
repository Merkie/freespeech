<script lang="ts">
	import { AppMode, CurrentPage, DashboardPage } from '$lib/stores';
	import Dashboard from './components/Dashboard/Dashboard.svelte';
	import TilePage from './components/TilePage/TilePage.svelte';
	let suffix = ' - FreeSpeech AAC';
	const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<svelte:head>
	{#if $AppMode === 'dashboard'}
		{#if $DashboardPage === 'library'}
			<title>Your Library{suffix}</title>
		{/if}
		{#if $DashboardPage === 'settings'}
			<title>Application Settings{suffix}</title>
		{/if}
		{#if $DashboardPage === 'documentation'}
			<title>Documentation{suffix}</title>
		{/if}
		{#if $DashboardPage === 'community'}
			<title>Community Resources{suffix}</title>
		{/if}
	{/if}
	{#if $AppMode === 'edit'}
		<title>Editing "{capitalizeString($CurrentPage)}"{suffix}</title>
	{/if}
	{#if $AppMode === 'home'}
		<title>{capitalizeString($CurrentPage)}{suffix}</title>
	{/if}
</svelte:head>

{#if $AppMode === 'dashboard'}
	<Dashboard />
{/if}

{#if ['home', 'edit'].includes($AppMode)}
	<TilePage />
{/if}
