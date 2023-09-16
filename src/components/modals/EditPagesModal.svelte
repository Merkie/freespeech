<script lang="ts">
	import { ActivePage, ActiveProject, hasUnsavedChanges } from '$ts/client/stores';
	import slugify from '$ts/common/slugify';
	import ModalShell from './ModalShell.svelte';
	import type { TilePage } from '$ts/common/types';

	let pageBeingEdited: TilePage | null = null;
	let pageNameValue = '';

	let addingPage = false;
	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
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
		addingPage = false;
	};

	const deletePage = async (pageId: string) => {
		const tempActiveProject = { ...$ActiveProject };

		//@ts-ignore
		$ActiveProject = {
			...$ActiveProject,
			pages: ($ActiveProject?.pages as TilePage[]).filter((page) => page.id !== pageId)
		};

		const responseJson = await fetch(
			`/api/v1/project/${$ActiveProject?.id}/page/${pageId}/delete`,
			{
				method: 'DELETE'
			}
		).then((res) => res.json());

		if (responseJson.error) {
			//@ts-ignore
			$ActiveProject = tempActiveProject;
			return alert(responseJson.error);
		}
	};

	const editPage = async () => {
		const tempActiveProject = { ...$ActiveProject };
		const tempActivePage = $ActivePage + '';

		//@ts-ignore
		$ActiveProject = {
			...$ActiveProject,
			pages: ($ActiveProject?.pages as TilePage[]).map((page) => {
				if (page.id === pageBeingEdited?.id) {
					return {
						...page,
						name: pageNameValue
					};
				}
				return page;
			})
		};

		$ActivePage = pageNameValue;

		const responseJson = await fetch(
			`/api/v1/project/${$ActiveProject?.id}/page/${pageBeingEdited?.id}/update`,
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
			$ActivePage = tempActivePage;
			return alert(responseJson.error);
		}

		pageBeingEdited = null;
	};
</script>

<ModalShell title="Edit Pages">
	{#if addingPage}
		<button
			on:click={() => (addingPage = false)}
			class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
		>
			<i class="bi bi-arrow-left" />
			Back
		</button>
		<input bind:value={pageName} type="text" placeholder="Page name" />
		<button
			disabled={creatingPage}
			on:click={createPage}
			class="mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
		>
	{:else if !!pageBeingEdited}
		<p class="mb-2">Page Name:</p>
		<input type="text" bind:value={pageNameValue} />
		<button
			on:click={editPage}
			class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50"
			>Submit Edits</button
		>
	{:else}
		{#each $ActiveProject?.pages || [] as page, index}
			<div
				class={`flex items-center gap-2 py-2 ${
					index !== 0 ? 'border border-x-0 border-b-0 border-zinc-700' : ''
				}`}
			>
				<p>{page.name}</p>
				<div class="flex-1" />
				<a
					href={`/app/project/${slugify($ActiveProject?.name || '').toLowerCase()}/${slugify(
						page.name || ''
					).toLowerCase()}`}
					on:click={() => ($ActivePage = page.name)}
					class="rounded-md border border-blue-500 bg-blue-600 p-1 px-2 text-sm">View</a
				>
				{#if page.name !== 'Home'}
					<button
						on:click={() => {
							pageBeingEdited = page;
							pageNameValue = page.name;
						}}
						class="rounded-md border border-yellow-500 bg-yellow-600 p-1 px-2 text-sm">Edit</button
					>
					<button
						on:click={() => deletePage(page.id)}
						class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
					>
				{/if}
			</div>
		{/each}

		<button
			on:click={() => (addingPage = true)}
			class="mt-2 rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-50"
			>Add New Page</button
		>
	{/if}
</ModalShell>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
