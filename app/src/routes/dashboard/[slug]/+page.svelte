<script lang="ts">
	//@ts-nocheck
	import DashboardContent from './components/DashboardContent.svelte';
	import Header from '$lib/client/components/Header.svelte';
	import SideBar from './components/SideBar.svelte';
	import { Me } from '$lib/client/stores';
</script>

<svelte:head>
	<title>Dashboard - FreeSpeech</title>
</svelte:head>

<Header uri={$Me.projects.length > 0 ? "app" : "dashboard/projects?create=true"} button_text="Application" />
<main>
	<SideBar />
	<DashboardContent />
</main>

<style>
	main {
		display: flex;
		gap: 20px;
		margin-right: 20px;
		margin-top: 50px;
		background: var(--background);
	}
	:global(body) {
		background: var(--background);
	}
</style>
