<script lang="ts">
	import { CurrentUser } from '$lib/stores';
	import DashboardHeader from './DashboardHeader.svelte';
	import DashboardLibrary from './DashboardLibrary.svelte';
</script>

<main class="flex-1 bg-zinc-800 flex flex-col">
	<DashboardHeader />
	<DashboardLibrary />
</main>
