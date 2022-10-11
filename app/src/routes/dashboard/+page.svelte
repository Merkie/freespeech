<script lang="ts">
	import trpc from '$lib/client/trpc';
	import { onMount } from 'svelte';
	import DashboardContent from './components/DashboardContent.svelte';
	import Header from '$lib/client/components/Header.svelte';
	import SideBar from './components/SideBar.svelte';
	import { Me } from '$lib/client/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	onMount(async () => {
		$Me = data.user;
	});
</script>

<Header uri="app" button_text="Application" />
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
	}
</style>
