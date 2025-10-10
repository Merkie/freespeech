<script lang="ts">
	import type { Writable } from 'svelte/store';
	interface Props {
		query: Writable<string>;
		children?: import('svelte').Snippet;
	}

	let { query, children }: Props = $props();
</script>

<div class="mb-2 flex items-center gap-2 border-b border-zinc-300 p-2">
	<div
		class="flex flex-1 items-center gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-1 px-4 text-sm"
	>
		<i class="bi bi-search"></i>
		<input
			bind:value={$query}
			placeholder="Search..."
			type="text"
			class="flex-1 bg-transparent p-1 outline-none"
		/>
	</div>
	{#if children}{@render children()}{:else}<!-- optional fallback -->{/if}
</div>
