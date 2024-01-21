<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Loading, openModal } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	async function deleteProject(pageId: string) {
		$Loading = true;

		await fetch(`/api/v1/project/${pageId}/delete`, {
			method: 'DELETE'
		}).then((res) => res.json());

		$Loading = false;

		await invalidateAll();
	}
</script>

<ModalShell title="Manage Projects" name="manage-projects">
	{#each $openModal.props?.projects || [] as project, index}
		<div
			class={`flex items-center gap-2 py-2 ${
				index !== 0 ? 'border border-x-0 border-b-0 border-zinc-700' : ''
			}`}
		>
			<p>{project.name}</p>
			<div class="flex-1" />
			<button
				disabled={$Loading}
				on:click={() => {
					$openModal = { name: 'edit-project', props: { project } };
				}}
				class="btn-sm btn-warning">Edit</button
			>
			<button
				disabled={$Loading}
				on:click={() => deleteProject(project.id)}
				class="btn-sm btn-danger">Delete</button
			>
		</div>
	{/each}
</ModalShell>
