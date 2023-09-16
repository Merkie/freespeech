<script lang="ts">
	import { ActivePage, ActiveProject, openModal } from '$ts/client/stores';
	import type { TilePage } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';

	let pageNameValue = $openModal.props.page.name;

	const editPage = async () => {
		const tempActiveProject = { ...$ActiveProject };
		const tempActivePage = $ActivePage + '';
		const editingCurrentPage = $ActivePage === $openModal.props.page.name;

		//@ts-ignore
		$ActiveProject = {
			...$ActiveProject,
			pages: ($ActiveProject?.pages as TilePage[]).map((page) => {
				if (page.id === $openModal.props.page.id) {
					return {
						...page,
						name: pageNameValue
					};
				}
				return page;
			})
		};

		if (editingCurrentPage) $ActivePage = pageNameValue;

		const responseJson = await fetch(
			`/api/v1/project/${$ActiveProject?.id}/page/${$openModal.props.page.id}/update`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: pageNameValue
				})
			}
		).then((res) => res.json());

		if (responseJson.error) {
			//@ts-ignore
			$ActiveProject = tempActiveProject;
			if (editingCurrentPage) $ActivePage = tempActivePage;
			return alert(responseJson.error);
		}
	};
</script>

<ModalShell title={'Edit Page'}>
	<button
		on:click={() => ($openModal = { name: 'edit-pages' })}
		class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
	>
		<i class="bi bi-arrow-left" />
		Back
	</button>
	<p class="mb-2">Page Name:</p>
	<input type="text" bind:value={pageNameValue} />
	<button
		on:click={editPage}
		class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit Edits</button
	>
</ModalShell>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
