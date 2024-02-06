<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { AddingPage, EditingPages } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	export let projectId: string;

	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
		if (creatingPage) return;
		creatingPage = true;
		await fetch(`/api/v1/project/${projectId}/page/create`, {
			method: 'POST',
			body: JSON.stringify({
				name: pageName
			})
		});
		await invalidateAll();
		creatingPage = false;

		$AddingPage = false;
		$EditingPages = true;
	};
</script>

{#if $AddingPage}
	<ModalShell
		closeModal={() => {
			$AddingPage = false;
		}}
		title="Create Page"
	>
		<button
			on:click={() => {
				$AddingPage = false;
				$EditingPages = true;
			}}
			class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
		>
			<i class="bi bi-arrow-left" />
			Back
		</button>
		<p class="mb-2">Page Name:</p>
		<input bind:value={pageName} type="text" />
		<button
			disabled={creatingPage}
			on:click={createPage}
			class="mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
		>
	</ModalShell>

	<style lang="postcss">
		input {
			@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
		}
	</style>
{/if}
