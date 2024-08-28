<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { EditingProjects, ProjectBeingEdited } from '$ts/client/stores';

	import ModalShell from './ModalShell.svelte';

	const updateProject = async () => {
		if (!$ProjectBeingEdited) return;

		const editProjectResponse = await api.project.edit($ProjectBeingEdited.id, {
			name: $ProjectBeingEdited.name,
			columns: $ProjectBeingEdited.columns,
			rows: $ProjectBeingEdited.rows
		});

		if (editProjectResponse.error) return alert(editProjectResponse.error);

		await invalidateAll();
		$ProjectBeingEdited = null;
		$EditingProjects = true;
	};
</script>

{#if $ProjectBeingEdited}
	<ModalShell
		closeModal={() => {
			$ProjectBeingEdited = null;
		}}
		title="Edit Project"
	>
		<p class="mb-2">Project name:</p>
		<input bind:value={$ProjectBeingEdited.name} type="text" class="mb-4" />
		<p class="mb-2">Project Dimensions:</p>
		<div class="mb-2 flex items-center gap-2">
			<input
				bind:value={$ProjectBeingEdited.columns}
				type="number"
				class="w-[50%]"
				name="columns"
				placeholder="Columns"
			/>
			<p>X</p>
			<input
				bind:value={$ProjectBeingEdited.rows}
				type="number"
				class="w-[50%]"
				name="rows"
				placeholder="Rows"
			/>
		</div>

		<button
			on:click={updateProject}
			type="submit"
			class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
		>
	</ModalShell>
{/if}

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}
</style>
