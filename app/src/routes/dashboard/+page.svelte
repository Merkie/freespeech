<script lang="ts">
	import trpc from '$lib/client/trpc';
	import { onMount } from 'svelte';
	import DashboardContent from './components/DashboardContent.svelte';
	import Header from './components/Header.svelte';
	import SideBar from './components/SideBar.svelte';
	import { Me } from '$lib/client/stores';

	onMount(async () => {
		const me = await trpc(fetch).query(`user:me_whole`);
		if (!me) return;
		$Me = me;
	});
</script>

<Header />
<main>
	<SideBar />
	<DashboardContent />
</main>

<style>
	main {
		display: flex;
		gap: 20px;
		margin-right: 20px;
	}
</style>
