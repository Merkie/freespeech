<script lang="ts">
	import { DiscardUnsavedChangesHandler, UnsavedChangesModalOpen } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
</script>

{#if $UnsavedChangesModalOpen}
	<ModalShell closeModal={() => ($UnsavedChangesModalOpen = false)} title="Create Project">
		<p class="mb-2">Project name</p>
		<div class="mt-2 flex gap-4">
			<button
				on:click={() => {
					$UnsavedChangesModalOpen = false;
				}}
				type="submit"
				class="flex-1 p-2 text-blue-50">Nevermind</button
			>
			<button
				on:click={() => {
					$DiscardUnsavedChangesHandler();
					$UnsavedChangesModalOpen = false;
					$DiscardUnsavedChangesHandler = () => {};
				}}
				type="submit"
				class="flex-1 rounded-md border border-red-500 bg-red-600 p-2 text-white"
				>Discard Changes</button
			>
		</div>
	</ModalShell>
{/if}
