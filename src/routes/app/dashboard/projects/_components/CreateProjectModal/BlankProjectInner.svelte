<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';

	let name: string;
	let columns = 6;
	let rows = 4;
	let showingAdvancedSettings = false;

	export let closeModal: () => void;

	const createProject = async () => {
		const createProjectResponse = await api.project.create({
			name,
			columns,
			rows
		});

		if (createProjectResponse.error) {
			return alert(createProjectResponse.error);
		}

		await invalidateAll();

		closeModal();
	};
</script>

<p class="mb-2">Project name:</p>
<div class="flex flex-col">
	<input type="text" name="name" bind:value={name} />

	{#if showingAdvancedSettings}
		<p class="my-2">Project Dimensions:</p>
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
	{:else}
		<button
			on:click={() => (showingAdvancedSettings = true)}
			class="w-fit py-4 text-sm hover:underline">Show advanced settings</button
		>
	{/if}
	<button
		on:click={createProject}
		type="submit"
		class="mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
	>
</div>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}
</style>
