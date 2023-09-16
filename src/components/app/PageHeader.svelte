<script>
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import EditPageModal from '$components/modals/EditPageModal.svelte';
	import CreatePageModal from '$components/modals/CreatePageModal.svelte';
	import { ActivePage, isEditing, openModal } from '$ts/client/stores';
</script>

{#if $openModal.name === 'edit-pages'}
	<EditPagesModal />
{/if}

{#if $openModal.name === 'edit-page'}
	<EditPageModal />
{/if}

{#if $openModal.name === 'create-page'}
	<CreatePageModal />
{/if}

<div class="flex items-center justify-center gap-2 bg-zinc-900 p-2 font-light text-zinc-100">
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<i class="bi bi-arrow-left" />
	</button> -->
	<p>{$ActivePage}</p>
	{#if $isEditing}
		<button
			on:click={() => ($openModal = { name: 'edit-pages' })}
			class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-2 text-sm">Edit Pages</button
		>
	{/if}
	<!-- <button class="p-1 px-3 rounded-md bg-zinc-900">
		<i class="bi bi-arrow-right" />
	</button> -->
</div>
