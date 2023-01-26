<script lang="ts">
	import { CurrentProject, CurrentPage } from '$lib/stores';
	import type { Page, Tile } from '@prisma/client';
	import Modal from '../Modal.svelte';
	export let callback: () => void;

	let pageName: string;

	const createPage = () => {
		if (!$CurrentProject || !$CurrentPage || !pageName) return;
		if ($CurrentProject.pages.find((page) => page.name.toLowerCase() === pageName.toLowerCase())) {
			alert('A page with that name already exists in this project.');
			return;
		}
		$CurrentProject.pages.push({
			id: Math.random().toString(36).substr(2, 9),
			name: pageName.toLowerCase(),
			tiles: [
				{
					id: Math.random().toString(36).substr(2, 9),
					text: 'New Tile',
					x: 0,
					y: 0
				}
			]
		} as Page & { tiles: Tile[] });
		$CurrentProject = $CurrentProject;
	};
</script>

<Modal {callback} title={'Create New Page'}>
	<div class="w-[500px] flex flex-col gap-2">
		<input
			bind:value={pageName}
			class="bg-zinc-200 border border-zinc-400 rounded-md p-2 text-zinc-600"
			type="text"
		/>
		<button
			on:click={createPage}
			class="bg-emerald-600 border border-emerald-400 text-emerald-50 rounded-md p-2">Create</button
		>
	</div>
</Modal>
