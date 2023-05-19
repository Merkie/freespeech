<script lang="ts">
	import { ActivePage, ActiveProject, hasUnsavedChanges } from '$ts/client/stores';
	import stringGate from '$ts/common/stringGate';
	import ModalShell from './ModalShell.svelte';
	import type { TilePage } from '$ts/common/types';

	let addingPage = false;
	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
		$hasUnsavedChanges = true;
		creatingPage = true;
		const response = await fetch('/api/project/create/page', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				projectid: $ActiveProject?.id,
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
		addingPage = false;
	};
</script>

<ModalShell title="Edit Pages">
	{#if addingPage}
		<button
			on:click={() => (addingPage = false)}
			class="flex items-center gap-1 mb-2 text-sm text-zinc-300"
		>
			<i class="bi bi-arrow-left" />
			Back
		</button>
		<input bind:value={pageName} type="text" placeholder="Page name" />
		<button
			disabled={creatingPage}
			on:click={createPage}
			class="bg-blue-600 text-blue-50 p-2 rounded-md mt-2 border border-blue-500">Submit</button
		>
	{:else}
		{#each $ActiveProject?.pages || [] as page, index}
			<div
				class={`py-2 flex gap-2 items-center ${
					index !== 0 ? 'border border-x-0 border-zinc-700 border-b-0' : ''
				}`}
			>
				<p>{page.name}</p>
				<div class="flex-1" />
				<a
					href={`/app/project/${stringGate($ActiveProject?.name || '').toLowerCase()}/${stringGate(
						page.name || ''
					).toLowerCase()}`}
					on:click={() => ($ActivePage = page.name)}
					class="text-sm p-1 px-2 bg-blue-600 border border-blue-500 rounded-md">View</a
				>
				{#if page.name !== 'Home'}
					<button class="text-sm p-1 px-2 bg-yellow-600 border border-yellow-500 rounded-md"
						>Edit</button
					>
					<button class="text-sm p-1 px-2 bg-red-600 border border-red-500 rounded-md"
						>Delete</button
					>
				{/if}
			</div>
		{/each}

		<button
			on:click={() => (addingPage = true)}
			class="bg-zinc-800 text-zinc-50 p-2 rounded-md mt-2 border border-zinc-700"
			>Add New Page</button
		>
	{/if}
</ModalShell>

<style lang="postcss">
	input {
		@apply px-2 p-1 rounded-md border border-zinc-300 text-zinc-800;
	}
</style>
