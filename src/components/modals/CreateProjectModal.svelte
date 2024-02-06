<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { AddingProject } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';

	let name: string;
	let columns = 6;
	let rows = 4;
	let showingAdvancedSettings = false;

	const createProject = async () => {
		const response = await fetch('/api/v1/project/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, columns, rows, isPublic: false, description: '' })
		});

		const data = await response.json();

		if (data.error) {
			return alert(data.error);
		}

		await invalidateAll();
		$AddingProject = false;
	};
</script>

{#if $AddingProject}
	<ModalShell closeModal={() => ($AddingProject = false)} title="Create Project">
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
				<!-- {#if $errors.columns}
				<p class="text-sm text-red-500">{$errors.columns}</p>
			{/if}
			{#if $errors.rows}
				<p class="text-sm text-red-500">{$errors.rows}</p>
			{/if} -->
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
	</ModalShell>
{/if}

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}
</style>
