<script lang="ts">
	import { formatDistance } from 'date-fns';
	import type { Project } from '@prisma/client';
	export let project: Project;
	const result = formatDistance(project.updated_at, Date.now(), { addSuffix: true });

	const navigate_to_app = () => {
		window.location.assign(`/app/${project.id}`);
	};
</script>

<button on:click={navigate_to_app}>
	{#if project.image}
		<img src={project.image} class="img" alt="project" />
	{/if}
	<div>
		<h1>{project.name}</h1>
		<p><i class="bx bxs-grid-alt" /> 698 Tiles</p>
		<p><i class="bx bxs-time-five" /> Viewed {result}</p>
	</div>
</button>

<style>
	button {
		display: flex;
		flex: 1;
		align-items: center;
		background: var(--base-100);
		border-radius: 10px;
		border: 1px solid var(--base-400);
		padding: 20px;
		gap: 20px;
		position: relative;
		width: fit-content;
		padding-right: 80px;
		text-align: left;
	}
	p {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	div {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: max-content;
	}
	.img {
		background: var(--base-500);
		width: 170px;
		height: 100px;
		border-radius: 10px;
		border: 1px solid var(--base-400);
	}
</style>
