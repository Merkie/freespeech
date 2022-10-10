<script>
	import { Me } from '$lib/client/stores';
	import trpc from '$lib/client/trpc';

	const make_project = async () => {
		const response = await trpc(fetch).mutation(`project:create`, {
			name: 'test',
			description: 'test',
			index: 0
		});
		console.log(response);
	};
</script>

<span class="header"
	><h1>Project</h1>
	<button on:click={make_project}>Create new project</button></span
>
{#each $Me.projects as project}
	<div>
		<b>{project.name}</b>
		<button on:click={() => window.location.assign(`/app/${project.id}`)}>Visit</button>
	</div>
{/each}

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	div {
		display: flex;
		align-items: center;
		gap: 20px;
		background-color: var(--base-100);
		padding: 20px;
		border-radius: 10px;
		border: 1px solid var(--base-400);
		filter: var(--shadow);
		margin-bottom: 20px;
		width: auto;
	}
</style>
