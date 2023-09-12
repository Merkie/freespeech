<script lang="ts">
	import { ActivePage, ActiveProject, hasUnsavedChanges, openModal } from '$ts/client/stores';

	import ModalShell from './ModalShell.svelte';

	let name = $openModal.props.project.name;
	let columns = $openModal.props.project.columns;
	let rows = $openModal.props.project.rows;

	const updateProject = async () => {
		const response = await fetch(`/api/v1/project/${$ActiveProject?.id}/update`);
	};
</script>

<ModalShell title="Edit Project">
	<p class="mb-2">Project name:</p>
	<input bind:value={name} type="text" class="mb-4" />
	<p class="mb-2">Project Dimensions:</p>
	<div class="mb-2 flex items-center gap-2">
		<input
			bind:value={columns}
			type="number"
			class="w-[50%]"
			name="columns"
			placeholder="Columns"
		/>
		<p>X</p>
		<input bind:value={rows} type="number" class="w-[50%]" name="rows" placeholder="Rows" />
	</div>

	<button type="submit" class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50"
		>Submit</button
	>
</ModalShell>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}
</style>
