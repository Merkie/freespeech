<script lang="ts">
	import CreateProjectInner from '../CreateProjectInner.svelte';
	export let callback: () => void;
	import { fade } from 'svelte/transition';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
	transition:fade={{ duration: 200 }}
	on:click={(e) => {
		// @ts-ignore
		if (e.target.tagName === '-MAIN') callback();
	}}
	class="fixed z-40 top-0 left-0 w-screen min-h-screen h-full bg-[rgba(0,0,0,0.5)]"
>
	<div
		class="fixed flex rounded-md border border-zinc-700 flex-col text-zinc-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[450px] bg-zinc-900"
	>
		<button on:click={callback} class="p-4 pb-0 w-min"><i class="bi bi-x-lg " /></button>
		<div class="flex-1 rounded-md bg-zinc-900 p-4 flex flex-col gap-2">
			<CreateProjectInner />
		</div>
	</div>
</main>
