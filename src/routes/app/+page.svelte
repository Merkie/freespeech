<script lang="ts">
	import { AppMode, CurrentPage, CurrentUser, DashboardPage } from '$lib/stores';
	import { onMount } from 'svelte';
	import AppModeSwitcher from '$lib/components/AppModeSwitcher.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import App from '$lib/components/App/App.svelte';

	let suffix = ' - FreeSpeech AAC'; // The suffix for the title
	const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1); // Capitalize the first letter of a string

	// State
	let authenticated = false;

	onMount(async () => {
		// Check the CurrentUser store (which is cached in localStorage) to see if the user is authenticated
		if ($CurrentUser) {
			console.log('authenticated from cache');
			authenticated = true;
		}

		// Get the current user data from the server
		const response = await fetch('/api/v1/user/me').then((res) => res.json());

		// If the auth fails, redirect to the login page
		if (!response._id) {
			window.location.href = '/login';
			return;
		}

		// Update the CurrentUser store with the data from the server
		delete response.success; // Remove the success property from the response
		console.log('updated user cache from server');
		$CurrentUser = response;
		authenticated = true;
	});
</script>

<!-- These if statements are the only way I can get the reactivity to work correctly -->
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

<main class="w-screen min-h-screen h-full bg-zinc-200 flex flex-col justify-end">
	{#if authenticated}
		{#if $AppMode === 'dashboard'}
			<Dashboard />
		{:else}
			<App />
		{/if}
	{/if}
	<AppModeSwitcher />
</main>
