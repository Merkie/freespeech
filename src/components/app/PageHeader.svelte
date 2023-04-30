<script>
	import LeftArrow from '$components/icons/LeftArrow.svelte';
	import RightArrow from '$components/icons/RightArrow.svelte';
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import { ActivePage, AppMode } from '$ts/client/stores';

	let editPagesModalOpen = false;
</script>

{#if editPagesModalOpen}
	<EditPagesModal closeModal={() => (editPagesModalOpen = false)} />
{/if}

<div class="p-2 bg-zinc-900 text-zinc-100 font-light flex items-center justify-center gap-2">
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<LeftArrow />
	</button> -->
	<p>{$ActivePage}</p>
	{#if $AppMode === 'edit'}
		<button
			on:click={() => (editPagesModalOpen = true)}
			class="bg-zinc-800 px-2 p-1 text-sm rounded-md border border-zinc-700">Edit Pages</button
		>
	{/if}
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<RightArrow />
	</button> -->
</div>
