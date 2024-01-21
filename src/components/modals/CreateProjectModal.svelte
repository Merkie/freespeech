<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { openModal } from '$ts/client/stores';
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
		$openModal = { name: '' };
	};
</script>

<ModalShell title="Create Project" name={'create-project'}>
	<p class="mb-2">Project name:</p>
	<div class="flex flex-col">
		<input class="input" type="text" placeholder="My Awesome Board" bind:value={name} />

		{#if showingAdvancedSettings}
			<p class="my-2">Project Dimensions:</p>
			<div class="mb-2 flex items-center gap-2">
				<input
					bind:value={columns}
					type="number"
					class="input w-[50%]"
					name="columns"
					placeholder="Columns"
				/>
				<p>X</p>
				<input
					bind:value={rows}
					type="number"
					class="input w-[50%]"
					name="rows"
					placeholder="Rows"
				/>
			</div>
		{:else}
			<button
				on:click={() => (showingAdvancedSettings = true)}
				class="w-fit py-4 text-sm hover:underline">Show advanced settings</button
			>
		{/if}
		<button on:click={createProject} type="submit" class="btn-sm btn-primary mt-2">Submit</button>
	</div>
</ModalShell>
