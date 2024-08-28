<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { EditingPages, PageBeingEdited } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	const editPage = async () => {
		if (!$PageBeingEdited) return;
		await api.page.edit($PageBeingEdited.id, {
			name: $PageBeingEdited.name
		});
		await invalidateAll();
		$PageBeingEdited = null;
		$EditingPages = true;
	};
</script>

{#if $PageBeingEdited}
	<ModalShell
		closeModal={() => {
			$PageBeingEdited = null;
		}}
		title={'Edit Page'}
	>
		<button
			on:click={() => {
				$PageBeingEdited = null;
				$EditingPages = true;
			}}
			class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
		>
			<i class="bi bi-arrow-left" />
			Back
		</button>
		<p class="mb-2">Page Name:</p>
		<input type="text" bind:value={$PageBeingEdited.name} />
		<button
			on:click={editPage}
			class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50"
			>Submit Edits</button
		>
	</ModalShell>
{/if}

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
