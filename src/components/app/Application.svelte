<script lang="ts">
	import PageHeader from './PageHeader.svelte';
	import TilePage from './TilePage.svelte';
	let containerHeight: number;
</script>

<PageHeader />
<div bind:clientHeight={containerHeight} class="flex-1 bg-zinc-100 overflow-auto">
	<TilePage {containerHeight} />
</div>
