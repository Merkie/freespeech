<script lang="ts">
	import { openModal } from '$ts/client/stores';
	import { fly } from 'svelte/transition';

	export let title: string;
	export let name = '1';

	function closeModal() {
		$openModal = { name: '' };
	}
</script>

{#if $openModal.name === name}
	<div
		in:fly={{ y: 50, duration: 100 }}
		class="fixed left-1/2 top-1/2 z-40 flex max-h-[90%] w-[100%] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 shadow-md sm:w-[90%] sm:max-w-[500px] sm:rounded-md"
	>
		<div class="mb-2 flex items-center gap-2">
			<button class="p-2" on:click={closeModal}>
				<i class="bi bi-x-lg" />
			</button>
			<p>{title}</p>
		</div>
		<div class="flex flex-col p-2">
			<slot />
		</div>
	</div>
{/if}
