<script lang="ts">
	import type { Writable } from 'svelte/store';
	export let query: Writable<string>;
</script>

<div class="mb-2 flex items-center gap-2 border-b border-zinc-300 p-2">
	<div
		class="flex flex-1 items-center gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-1 px-4 text-sm"
	>
		<i class="bi bi-search" />
		<input
			bind:value={$query}
			placeholder="Search..."
			type="text"
			class="flex-1 bg-transparent p-1 outline-none"
		/>
	</div>
	<slot><!-- optional fallback --></slot>
</div>
