<script>
	import { Me } from '$lib/client/stores';
	console.log($Me);
</script>

<h1>Projects</h1>
{#each $Me.projects as project}
	<div>
		<b>{project.name}</b>
		<button on:click={() => window.location.assign(`/app/${project.id}`)}>Visit</button>
	</div>
{/each}

<style>
	h1 {
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
