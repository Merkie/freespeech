<script lang="ts">
	import { formatDistance } from 'date-fns';
	import type { Project, User } from '@prisma/client';
	export let project: Project & { author: User };
	const result = formatDistance(project.updated_at, Date.now(), { addSuffix: true });

	export let explore = false;

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
		{#if project.description}
			 <p>{project.description}</p>
		{:else}
			<p><i class="bx bxs-grid-alt" /> 698 Tiles</p>
		{/if}
		{#if explore}
			<p><i class="bx bxs-time-five" /> Updated {result}</p>
			<p><img style="border-radius: 50%" width="30px" src={project.author.image || '/profile.png'} alt=""> {project.author.name}</p>
		{:else}
			<p><i class="bx bxs-time-five" /> Viewed {result}</p>
		{/if}
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

	@media (max-width: 750px) {
		h1 {
			font-size: 20px !important;
		}

		.img {
			width: 100px;
			height: 70px;
		}

		button {
			padding-right: 0;
		}
	}
</style>
