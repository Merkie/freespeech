<script lang="ts">
	import { DiscardUnsavedChangesHandler, UnsavedChangesModalOpen } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
</script>

{#if $UnsavedChangesModalOpen}
	<ModalShell closeModal={() => ($UnsavedChangesModalOpen = false)} title="Unsaved Changes">
		<p class="mb-4 text-zinc-400">Warning! You have unsaved changes.</p>
		<div class="flex justify-end gap-4">
			<button
				onclick={() => {
					$UnsavedChangesModalOpen = false;
				}}
				type="submit"
				class="rounded-md p-2 px-4"
			>
				Keep Editing</button
			>
			<button
				onclick={() => {
					$DiscardUnsavedChangesHandler();
					$UnsavedChangesModalOpen = false;
					$DiscardUnsavedChangesHandler = () => {};
				}}
				type="submit"
				class="rounded-md border border-red-500 bg-red-600 p-2 px-4 text-white"
				>Discard Changes</button
			>
		</div>
	</ModalShell>
{/if}
