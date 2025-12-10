<script lang="ts">
	import { refreshProjectPages } from '$ts/client/page-cache';
	import api from '$ts/client/api';
	import { AddingPage, EditingPages } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	export let projectId: string;

	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
		if (creatingPage) return;
		creatingPage = true;
		await api.page.create({ projectId, name: pageName });
		await refreshProjectPages();
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
