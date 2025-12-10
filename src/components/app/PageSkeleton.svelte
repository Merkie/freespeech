<script lang="ts">
	import { LocalSettings } from '$ts/client/stores';

	export let columns: number = 6;
	export let rows: number = 4;

	$: tileCount = columns * rows;
</script>

<!-- Header skeleton -->
<div class="flex h-14 items-center justify-center bg-zinc-900 p-2">
	<p class="font-light text-zinc-500">Loading...</p>
</div>

<!-- Sentence builder skeleton (only if enabled) -->
{#if $LocalSettings.sentenceBuilder}
	<div class="flex h-[100px] items-center gap-2 border-b border-zinc-200 bg-zinc-50 p-2">
		<div class="flex h-full flex-1 items-center gap-2 overflow-x-auto"></div>
		<div class="flex h-full items-center gap-2">
			<div class="h-[84px] w-[84px] rounded-md bg-zinc-200/50"></div>
			<div class="h-[84px] w-[84px] rounded-md bg-zinc-200/50"></div>
		</div>
	</div>
{/if}

<!-- Tile grid skeleton -->
<div
	style={`grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr);`}
	class="grid flex-1 gap-2 bg-zinc-100 p-2"
>
	{#each Array(tileCount) as _, i}
		<div class="rounded-md border border-zinc-300/50 bg-zinc-200/30"></div>
	{/each}
</div>
