<script lang="ts">
	import { openModal } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let title: string;

	const closeModal = () => {
		$openModal = { name: '' };
	};

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<main
		transition:fade={{ duration: 100 }}
		on:keypress={(e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		}}
		on:click={(e) => {
			//@ts-ignore
			if (e.target.tagName === 'MAIN') {
				closeModal();
			}
		}}
		class="fixed top-0 left-0 h-screen w-screen grid place-items-center bg-[rgba(0,0,0,0.5)] z-30"
	>
		<div
			transition:fly={{ y: 100, duration: 200 }}
			class="bg-zinc-900 border border-zinc-800 text-zinc-100 font-light shadow-md p-2 rounded-md flex flex-col w-[90%] max-w-[500px] max-h-[90%] overflow-y-auto"
		>
			<div class="flex items-center gap-2 mb-2">
				<button on:click={closeModal}>
					<i class="bi bi-x" />
				</button>
				<p>{title}</p>
			</div>
			<div class="p-2 flex flex-col">
				<slot />
			</div>
		</div>
	</main>
{/if}
