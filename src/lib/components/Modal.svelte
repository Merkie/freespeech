<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	export let callback: () => void;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let title: string;
	import { fade, scale } from 'svelte/transition';
</script>

<main
	transition:fade={{ duration: 200 }}
	class="fixed z-40 top-0 left-0 w-screen min-h-screen h-full bg-[rgba(0,0,0,0.5)]"
>
	<div
		use:clickOutside={callback}
		transition:scale
		class="fixed flex rounded-md border border-zinc-700 flex-col text-zinc-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900"
		style={`width: ${width}px; height: ${height}px;`}
	>
		<div class="relative flex items-center p-2">
			<button on:click={callback} class="w-min"><i class="bi bi-x-lg " /></button>
			<p class="flex-1 text-center">{title}</p>
		</div>
		<div class="flex-1 rounded-md bg-zinc-900 p-4 flex flex-col gap-2">
			<slot />
		</div>
	</div>
</main>
