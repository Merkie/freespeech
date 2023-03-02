<script lang="ts">
	import { CurrentProject, CurrentPage } from '$lib/stores';
	import { createTemplate } from '$lib/ts/templateActions';
	import type { Page, Tile } from '$lib/types';
	import { createId } from '@paralleldrive/cuid2';
	import Modal from '../../../../lib/components/Modal.svelte';
	export let callback: () => void;

	let pageName: string;

	const handleTemplateCreation = () => {
		createTemplate({ templateName: pageName.toLowerCase() });
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
			on:click={handleTemplateCreation}
			class="bg-emerald-600 border border-emerald-400 text-emerald-50 rounded-md p-2">Create</button
		>
	</div>
</Modal>
