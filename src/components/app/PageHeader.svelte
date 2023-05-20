<script>
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import { ActivePage, isEditing, openModal } from '$ts/client/stores';
</script>

{#if $openModal.name === 'edit-pages'}
	<EditPagesModal />
{/if}

<div class="p-2 bg-zinc-900 text-zinc-100 font-light flex items-center justify-center gap-2">
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<i class="bi bi-arrow-left" />
	</button> -->
	<p>{$ActivePage}</p>
	{#if $isEditing}
		<button
			on:click={() => ($openModal = { name: 'edit-pages' })}
			class="bg-zinc-800 px-2 p-1 text-sm rounded-md border border-zinc-700">Edit Pages</button
		>
	{/if}
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<i class="bi bi-arrow-right" />
	</button> -->
</div>
