<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ActiveProject, openModal } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	const deleteProject = async (pageId: string) => {
		const responseJson = await fetch(`/api/v1/project/${pageId}/delete`, {
			method: 'DELETE'
		}).then((res) => res.json());

		if (responseJson.error) {
			return alert(responseJson.error);
		}

		await invalidateAll();
	};
</script>

<ModalShell title="Manage Projects">
	{#each $openModal.props.projects || [] as project, index}
		<div
			class={`flex items-center gap-2 py-2 ${
				index !== 0 ? 'border border-x-0 border-b-0 border-zinc-700' : ''
			}`}
		>
			<p>{project.name}</p>
			<div class="flex-1" />

			<button
				on:click={() => {
					$openModal = { name: 'edit-project', props: { project } };
				}}
				class="rounded-md border border-yellow-500 bg-yellow-600 p-1 px-2 text-sm">Edit</button
			>
			<button
				on:click={() => deleteProject(project.id)}
				class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
			>
		</div>
	{/each}
</ModalShell>
