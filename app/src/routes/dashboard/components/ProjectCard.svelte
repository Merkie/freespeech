<script lang="ts">
	import type { Project } from '@prisma/client';
	export let project: Project;
</script>

<button on:click={() => window.location.assign('/app/' + project.id)}>
	<span class="img" />
	<div>
		<h1>{project.name}</h1>
		<p><i class="bx bxs-grid-alt" /> 698 Tiles</p>
		<p><i class="bx bxs-time-five" /> Recently opened</p>
	</div>
	<span class="more">
		<i class="bx bx-dots-horizontal-rounded" />
	</span>
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
	}
	.img {
		background: var(--base-500);
		width: 170px;
		height: 100px;
		border-radius: 10px;
		border: 1px solid var(--base-400);
	}
	.more {
		position: absolute;
		right: 10px;
		top: 5px;
		font-size: 20px;
	}
</style>
