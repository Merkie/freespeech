<script lang="ts">
	import type { Writable } from 'svelte/store';
	export let query: Writable<string>;
</script>

<div class="p-2 border-b border-zinc-700 mb-2 flex items-center gap-2">
	<div
		class="px-2 p-1 text-sm border bg-zinc-800 border-zinc-700 flex-1 rounded-md items-center flex gap-2"
	>
		<i class="bi bi-search" />
		<input
			bind:value={$query}
			placeholder="Search settings..."
			type="text"
			class="flex-1 outline-none bg-transparent"
		/>
	</div>
	<slot><!-- optional fallback --></slot>
</div>
