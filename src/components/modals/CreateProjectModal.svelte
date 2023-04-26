<script lang="ts">
	import ModalShell from './ModalShell.svelte';
	export let closeModal: () => void;

	let projectName: string;

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
</script>

<ModalShell {closeModal} title="Create Project">
	<p>Project name:</p>
	<input type="text" bind:value={projectName} />
	<button
		on:click={createProject}
		class="bg-blue-600 text-blue-50 p-2 rounded-md mt-2 border border-blue-500">Submit</button
	>
</ModalShell>

<style lang="postcss">
	input {
		@apply px-2 p-1 rounded-md border border-zinc-300 text-zinc-800;
	}
</style>
