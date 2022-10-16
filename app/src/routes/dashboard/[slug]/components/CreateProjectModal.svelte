<script lang="ts">
	import { clickOutside } from '$lib/client/clickOutside';
	import Spinner from '$lib/client/components/Spinner.svelte';
	import { IsProjectCreationModalOpen } from '$lib/client/stores';
	//@ts-nocheck

	import trpc from '$lib/client/trpc';

	let name: string;
	let columns: number;
	let clone_project_id: string;

	export let add_project: Function;
	let loading = false;
	let using_template = false;

	const clone_project = async () => {
		loading = true;
		const response = await trpc(fetch).mutation(`project:clone`, {
			id: clone_project_id,
			index: 0
		});
		if (!response) return;
		loading = false;

		//@ts-ignore
		add_project(response);

		$IsProjectCreationModalOpen = false;
	};

	const make_project = async () => {
		loading = true;
		const response = await trpc(fetch).mutation(`project:create`, {
			name: name || 'My awesome project',
			description: '',
			index: 0,
			columns: columns || 8
		});
		if (!response) return;
		loading = false;

		//@ts-ignore
		add_project(response);

		$IsProjectCreationModalOpen = false;
	};

	const close_modal = () => {
		if (loading) return;
		$IsProjectCreationModalOpen = false;
	};
</script>

{#if $IsProjectCreationModalOpen}
	<main use:clickOutside on:click_outside={close_modal}>
		<h1>Create project</h1>
		<div>
			<span class={using_template ? '' : 'selected'} on:click={() => (using_template = false)}
				>Start from scratch</span
			>
			<span class={!using_template ? '' : 'selected'} on:click={() => (using_template = true)}
				>Start from a template</span
			>
		</div>
		{#if using_template}
			<p>Project ID:</p>
			<input bind:value={clone_project_id} type="string" placeholder="..." />
			<button disabled={loading} on:click={clone_project}>Clone Project</button>
		{:else}
			<p>Project name</p>
			<input bind:value={name} type="text" placeholder="My awesome project" />
			<p>Default columns</p>
			<input bind:value={columns} type="number" placeholder="8" />
			<button disabled={loading} on:click={make_project}>Create Project</button>
		{/if}
		<div style={`opacity: ${loading ? '1' : '0'}`} class="spinner">
			<Spinner />
		</div>
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
		width: min(500px, 80%);
		box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.8);
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
		cursor: pointer;
	}

	.spinner {
		all: unset;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
