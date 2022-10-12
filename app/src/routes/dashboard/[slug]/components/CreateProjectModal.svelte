<script lang="ts">
	import { clickOutside } from '$lib/client/clickOutside';
	import { IsProjectCreationModalOpen } from '$lib/client/stores';
	//@ts-nocheck

	import trpc from '$lib/client/trpc';

	let name: string;
	let columns: number;

	export let add_project: Function;

	const make_project = async () => {
		const response = await trpc(fetch).mutation(`project:create`, {
			name: name || 'My awesome project',
			description: '',
			index: 0,
			columns: columns || 8
		});
		if (!response) return;

		//@ts-ignore
		add_project(response);

		$IsProjectCreationModalOpen = false;
	};

	const close_modal = () => {
		$IsProjectCreationModalOpen = false;
	};
</script>

{#if $IsProjectCreationModalOpen}
	<main use:clickOutside on:click_outside={close_modal}>
		<h1>Create project</h1>
		<div><span class="selected">Start from scratch</span> <span>Start from a template</span></div>
		<p>Project name</p>
		<input bind:value={name} type="text" placeholder="My awesome project" />
		<p>Default columns</p>
		<input bind:value={columns} type="number" placeholder="8" />
		<button on:click={make_project}>Create Project</button>
	</main>
{/if}

<style>
	main {
		padding: 20px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--base-100);
		border-radius: 10px;
		border: 1px solid var(--base-400);
		width: min(500px, 100%);
		box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	main * {
		width: calc(100% - 35px);
	}

	div {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		margin-bottom: 20px;
		width: 100%;
	}

	span {
		width: fit-content;
		font-size: 20px;
		cursor: pointer;
		opacity: 0.5;
	}

	.selected {
		opacity: 1;
		text-decoration: underline;
	}

	input {
		margin-bottom: 20px;
	}

	p {
		margin-bottom: 5px;
	}

	button {
		width: 100%;
	}
</style>
