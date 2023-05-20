<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import ModalShell from './ModalShell.svelte';
	import { openModal } from '$ts/client/stores';
	export let form: any;

	let projectName: string;
	let showingAdvancedSettings = false;

	const createProject = async () => {
		const response = await fetch('/api/project/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: projectName })
		});

		const data = await response.json();

		if (data.error) {
			return alert(data.error);
		}

		alert('Project created successfully');
		window.location.reload();
	};

	const { form: createProjectForm, errors, enhance, message, constraints } = superForm(form);

	$: {
		if ($message === 'good') {
			$openModal = { name: '' };
		}
	}
</script>

<ModalShell title="Create Project">
	<p class="mb-2">Project name:</p>
	<form class="flex flex-col" use:enhance method="POST" action="?/create">
		<input type="text" name="name" bind:value={$createProjectForm.name} {...$constraints.name} />
		{#if $errors.name}
			<p class="text-red-500 text-sm">{$errors.name}</p>
		{/if}

		{#if showingAdvancedSettings}
			<p class="my-2">Project Dimensions:</p>
			<div class="flex items-center gap-2 mb-2">
				<input
					type="number"
					class="w-[50%]"
					name="columns"
					placeholder="Columns"
					bind:value={$createProjectForm.columns}
					{...$constraints.columns}
				/>
				<p>X</p>
				<input
					type="number"
					class="w-[50%]"
					name="rows"
					placeholder="Rows"
					bind:value={$createProjectForm.rows}
					{...$constraints.rows}
				/>
			</div>
			{#if $errors.columns}
				<p class="text-red-500 text-sm">{$errors.columns}</p>
			{/if}
			{#if $errors.rows}
				<p class="text-red-500 text-sm">{$errors.rows}</p>
			{/if}
		{:else}
			<button
				on:click={() => (showingAdvancedSettings = true)}
				class="text-sm text-zinc-300 w-fit py-4 hover:underline">Show advanced settings</button
			>
		{/if}
		<button
			type="submit"
			class="bg-blue-600 text-blue-50 p-2 rounded-md mt-2 border border-blue-500">Submit</button
		>
	</form>
</ModalShell>

<style lang="postcss">
	input {
		@apply px-2 p-1 rounded-md border border-zinc-300 text-zinc-800;
	}
</style>
