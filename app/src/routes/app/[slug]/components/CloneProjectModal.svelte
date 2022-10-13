<script lang="ts">
	// @ts-nocheck
	// Trpc
	import trpc from '$lib/client/trpc';
	import { CloneModalProject } from '$lib/client/stores';
	import { clickOutside } from '$lib/client/clickOutside';
	import Spinner from '$lib/client/components/Spinner.svelte';

	let loading = false;

	const close_modal = () => {
		if(loading) return;
		$CloneModalProject = null;
	};

	const clone_project = async () => {
		loading = true;
		const response = await trpc(fetch).mutation(`project:clone`, {
			id: $CloneModalProject.id,
			index: 0
		});
		if (!response) return;

		window.location.assign('/app/' + response.id);
		loading = false;
	};
</script>

{#if $CloneModalProject}
	<main use:clickOutside on:click_outside={close_modal}>
		<h3>Clone Project</h3>
		<p>This is not your project so you can't make any edits to it. Would you like to clone it to your library?</p>
		<span>
			<button on:click={clone_project}>Clone This Project</button>
			<button class="gray" on:click={close_modal}>Cancel</button>
		</span>
		<div style={`opacity: ${loading ? '1' : '0'}`} class="spinner">
			<Spinner />
		</div>
	</main>
{/if}

<style>
	main {
		position: fixed;
		display: flex;
		flex-direction: column;
		padding: 20px;
		min-width: 300px;
		background-color: var(--base-100);
		border: 1px solid var(--base-400);
		border-radius: 10px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 0 100000px rgba(0, 0, 0, 0.2);
		gap: 20px;
	}

	span {
		display: flex;
		gap: 10px;
	}

	span * {
		flex: 1;
	}

	button {
		background-color: var(--success-300);
		border: 1px solid var(--success-400);
	}

	.gray {
		filter: grayscale(100%);
	}

	button {
		background: var(--primary-300);
		border-color: var(--primary-400);
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	@media (max-width: 750px) {
		span {
			flex-direction: column;
		}

		span * {
			width: 100%;
		}
	}
</style>
