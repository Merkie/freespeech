<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { cn } from '$ts/client/cn';

	let name: string = $state('');
	let columns = $state(6);
	let rows = $state(4);
	let showingAdvancedSettings = $state(false);

	let loading = $state(false);

	const createProject = async () => {
		if (loading) return;
		loading = true;

		const createProjectResponse = await api.project.create({
			name,
			columns,
			rows
		});

		if (createProjectResponse.error) {
			return alert(createProjectResponse.error);
		}

		let createdProjectId = '';

		if (createProjectResponse.projectId) {
			await api.project.updateThumbnail(createProjectResponse.projectId);
			createdProjectId = createProjectResponse.projectId;
		}

		if (createdProjectId) {
			window.location.assign(`/app/project/${createdProjectId}`);
		} else {
			loading = false;
			await invalidateAll();
		}
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
			onclick={() => (showingAdvancedSettings = true)}
			class="w-fit py-4 text-sm hover:underline">Show advanced settings</button
		>
	{/if}
	<button
		onclick={createProject}
		type="submit"
		class={cn(
			'mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50 transition-all',
			{
				'pointer-events-none opacity-50': loading
			}
		)}>Submit</button
	>
</div>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}
</style>
