<script lang="ts">
	import { CurrentProject, CurrentPage } from '$lib/stores';
	import type { Page, Tile } from '$lib/types';
	import { createId } from '@paralleldrive/cuid2';
	import Modal from '../Modal.svelte';
	export let callback: () => void;

	let pageName: string;

	const createTemplate = () => {
		$CurrentProject!.templates = [
			...($CurrentProject?.templates || []),
			{
				_id: createId(),
				parentPageId:
					$CurrentProject?.pages.find(
						(page) => page.name.toLowerCase() === $CurrentPage.toLowerCase()
					)?._id || '',
				name: `${$CurrentPage} Template`,
				tiles: []
			}
		];
		$CurrentProject = $CurrentProject;
	};
</script>

<Modal {callback} title={'Create New Template'}>
	<div class="w-[500px] flex flex-col gap-2">
		<input
			bind:value={pageName}
			placeholder="Template Name"
			class="bg-zinc-200 border border-zinc-400 rounded-md p-2 text-zinc-600"
			type="text"
		/>
		<button
			on:click={createTemplate}
			class="bg-emerald-600 border border-emerald-400 text-emerald-50 rounded-md p-2">Create</button
		>
	</div>
</Modal>
