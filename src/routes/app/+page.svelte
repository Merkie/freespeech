<script lang="ts">
	import { AppMode } from '$lib/stores';
	import Dashboard from './components/Dashboard/Dashboard.svelte';
	import TilePage from './components/TilePage/TilePage.svelte';
</script>

{#if $AppMode === 'dashboard'}
	<Dashboard />
{/if}

{#if ['home', 'edit'].includes($AppMode)}
	<TilePage />
{/if}
