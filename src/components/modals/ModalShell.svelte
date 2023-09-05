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
		class="fixed left-0 top-0 z-30 grid h-screen w-screen place-items-center bg-[rgba(0,0,0,0.5)]"
	>
		<div
			transition:fly={{ y: 100, duration: 200 }}
			class="flex max-h-[90%] w-[90%] max-w-[500px] flex-col overflow-y-auto rounded-md border border-zinc-300 bg-zinc-200 p-2 shadow-md"
		>
			<div class="mb-2 flex items-center gap-2">
				<button on:click={closeModal}>
					<i class="bi bi-x" />
				</button>
				<p>{title}</p>
			</div>
			<div class="flex flex-col p-2">
				<slot />
			</div>
		</div>
	</main>
{/if}
