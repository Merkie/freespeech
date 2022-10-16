<script lang="ts">
	import Modal from '$lib/client/components/Modal.svelte';
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
  <Modal title={'Create project'} close_modal={() => $IsProjectCreationModalOpen = false} {loading}>
    <div>
			<span
				on:keypress={() => null}
				class={using_template ? '' : 'selected'}
				on:click={() => (using_template = false)}>Start from scratch</span
			>
			<span
				on:keypress={() => null}
				class={!using_template ? '' : 'selected'}
				on:click={() => (using_template = true)}>Start from a template</span
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
  </Modal>
{/if}

<style>
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
    width: calc(100% - 35px);
	}

	p {
		margin-bottom: 5px;
	}

	button {
		width: 100%;
		cursor: pointer;
	}
</style>
