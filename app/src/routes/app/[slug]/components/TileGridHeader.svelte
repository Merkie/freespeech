<script lang="ts">
	// Stores
	import {
		AppProject,
		CurrentPageId,
		PageHistory,
		PageHistoryIndex,
		EditorTool,
		EditorTools,
		InEditMode
	} from '$lib/client/stores';
	import trpc from '$lib/client/trpc';

	// State
	let name = 'Home';
	let refreshing = false;

	//bindings
	let page_header: HTMLElement;

	// Navigate backwards
	const navigate_backwards = () => {
		if ($PageHistoryIndex < $PageHistory.length - 1) {
			$PageHistoryIndex += 1;
			$CurrentPageId = $PageHistory[$PageHistoryIndex];
		}
	};

	// Navigate forwards
	const navigate_forwards = () => {
		if ($PageHistoryIndex > 0) {
			$PageHistoryIndex += -1;
			$CurrentPageId = $PageHistory[$PageHistoryIndex];
		}
	};

	// Rename page
	const handle_rename_page = async (e: { target: any }) => {
		const updated_page = await trpc(fetch).mutation('page:rename', {
			id: $CurrentPageId,
			name: e.target.innerText
		});
		if (!updated_page) return;

		$AppProject.pages = $AppProject.pages.map((page) => {
			if (page.id === updated_page.id) {
				return { ...page, name: updated_page.name };
			}
			return page;
		});
	};

	$: {
		let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		try {
			name = $AppProject.pages[current_page_index].name;
		} catch (e) {
			name = 'Home222';
		}
		// save the page name if edited
		if(!$InEditMode) {
			try {
				if(page_header.innerText !== name) {
					handle_rename_page({target: page_header});
				}
			} catch(e) {}
		}
	}
</script>

<section>
	<button
		class={`refresh ${refreshing ? 'refreshing' : ''}`}
		on:click={() => {
			refreshing = true;
			window.location.assign(`/app/${$AppProject.id}`);
		}}
	>
		<i class="bx bx-refresh" />
	</button>
	<button disabled={!($PageHistoryIndex < $PageHistory.length - 1)} on:click={navigate_backwards}>
		<i class="bx bx-left-arrow-alt" />
	</button>
	<p bind:this={page_header} contenteditable={$EditorTool == EditorTools.text && $InEditMode}>
		{name}
	</p>
	<button disabled={!($PageHistoryIndex > 0)} on:click={navigate_forwards}>
		<i class="bx bx-right-arrow-alt" />
	</button>
</section>

<style>
	section {
		background-color: var(--base-100);
		border: 1px solid var(--base-400);
		border-left: none;
		border-right: none;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		font-size: 25px;
		position: relative;
	}
	button {
		font-size: 40px;
		padding: 0px;
		background: transparent;
		border: none;
	}

	p {
		min-width: 200px;
		text-align: center;
	}

	.refresh {
		position: absolute;
		left: 10px;
		top: 15px;
	}

	.refreshing {
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
