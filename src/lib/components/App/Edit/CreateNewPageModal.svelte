<script lang="ts">
	import { CurrentProject, CurrentPage } from '$lib/stores';
	import type { Page, Tile } from '$lib/types';
	import { createId } from '@paralleldrive/cuid2';
	import { createPage as CreatePage } from '$lib/ts/pageActions';
	import Modal from '../../../../lib/components/Modal.svelte';
	export let callback: () => void;

	let pageName: string;

	const createPage = () => {
		if (!$CurrentProject || !$CurrentPage || !pageName) return;
		if ($CurrentProject.pages.find((page) => page.name.toLowerCase() === pageName.toLowerCase())) {
			alert('A page with that name already exists in this project.');
			return;
		}

		CreatePage({ pageName: pageName.toLowerCase() });

		// Close the modal after the page is created
		callback();
	};
</script>

<Modal {callback} title={'Create New Page'}>
	<div class="w-[500px] flex flex-col gap-2">
		<input
			bind:value={pageName}
			placeholder="Page Name"
			class="bg-zinc-200 border border-zinc-400 rounded-md p-2 text-zinc-600"
			type="text"
		/>
		<button
			on:click={createPage}
			class="bg-emerald-600 border border-emerald-400 text-emerald-50 rounded-md p-2">Create</button
		>
	</div>
</Modal>
