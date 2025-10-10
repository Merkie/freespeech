<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		title: string;
		closeModal: () => void;
		children?: import('svelte').Snippet;
	}

	let { title, closeModal, children }: Props = $props();

	let visible = $state(false);

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<main
		transition:fade={{ duration: 100 }}
		onkeypress={(e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		}}
		onclick={(e) => {
			//@ts-ignore
			if (e.target.tagName === 'MAIN') {
				closeModal();
			}
		}}
		class="fixed left-0 top-0 z-30 grid h-screen w-screen place-items-center bg-black/[75%]"
	>
		<div
			transition:fly={{ y: 100, duration: 200 }}
			class="flex max-h-[90%] w-[100%] flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-6 text-zinc-200 shadow-md sm:w-[90%] sm:max-w-[500px] sm:rounded-xl"
		>
			<div class="mb-2 flex items-center justify-between gap-2">
				<p class="text-lg font-bold">{title}</p>
				<button aria-label="Close modal" onclick={closeModal}>
					<i class="bi bi-x-lg flex items-center"></i>
				</button>
			</div>
			<div class="flex flex-col">
				{@render children?.()}
			</div>
		</div>
	</main>
{/if}
