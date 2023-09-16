<script lang="ts">
	import { ActiveProject, hasUnsavedChanges, openModal } from '$ts/client/stores';
	import type { TilePage } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';

	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
		if (creatingPage) return;
		$hasUnsavedChanges = true;
		creatingPage = true;
		const response = await fetch(`/api/v1/project/${$ActiveProject?.id}/page/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: pageName
			})
		});
		creatingPage = false;

		const data = await response.json();

		if (data.error) return alert(data.error);

		//@ts-ignore
		$ActiveProject = {
			...$ActiveProject,
			pages: [...($ActiveProject?.pages as TilePage[]), data.page as TilePage]
		};

		$openModal = { name: 'edit-pages' };
	};
</script>

<ModalShell title="Create Page">
	<button
		on:click={() => ($openModal = { name: 'edit-pages' })}
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
