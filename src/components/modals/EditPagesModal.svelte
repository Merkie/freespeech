<script lang="ts">
	import { ActivePage, ActiveProject, openModal } from '$ts/client/stores';
	import slugify from '$ts/common/slugify';
	import ModalShell from './ModalShell.svelte';
	import type { TilePage } from '$ts/common/types';

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
</script>

<ModalShell title="Edit Pages">
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
						$openModal = { name: 'edit-page', props: { page } };
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
		on:click={() => {
			$openModal = { name: 'create-page' };
		}}
		class="mt-2 rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-50">Add New Page</button
	>
</ModalShell>
