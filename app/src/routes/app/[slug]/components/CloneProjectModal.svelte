<script lang="ts">
	// Trpc
	import trpc from '$lib/client/trpc';

	// Stores
	import { CloneModalProject } from '$lib/client/stores';

	// Components
	import Modal from '$lib/client/components/Modal.svelte';

	// State
	let loading = false;

	// Closes modal
	const close_modal = () => {
		if (loading) return;
		$CloneModalProject = null;
	};

	// Clones project
	const clone_project = async () => {
		loading = true;
		const response = await trpc(fetch).mutation(`project:clone`, {
			id: $CloneModalProject?.id || '',
			index: 0
		});
		if (!response) return;

		window.location.assign('/app/' + response.id);
		loading = false;
	};
</script>

{#if $CloneModalProject}
	<Modal {loading} title={'Clone project'} {close_modal}>
		<div>
			<p>
				This is not your project so you can't make any edits to it. Would you like to clone it to
				your library?
			</p>
			<span>
				<button on:click={clone_project}>Clone This Project</button>
				<button class="gray" on:click={close_modal}>Cancel</button>
			</span>
		</div>
	</Modal>
{/if}

<style>
	span {
		display: flex;
		gap: 10px;
	}

	div {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		margin-top: 20px;
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
