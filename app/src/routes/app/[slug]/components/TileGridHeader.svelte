<script>
	// Stores
	import { AppProject, CurrentPageId, PageHistory, PageHistoryIndex } from '$lib/client/stores';

	// State
	let name = 'Home';

	// Navigate backwards
	const navigate_backwards = () => {
		if($PageHistoryIndex < $PageHistory.length - 1) {
			$PageHistoryIndex += 1;
			$CurrentPageId = $PageHistory[$PageHistoryIndex];
		}
	};

	// Navigate forwards
	const navigate_forwards = () => {
		if($PageHistoryIndex > 0) {
			$PageHistoryIndex += -1;
			$CurrentPageId = $PageHistory[$PageHistoryIndex];
		}
	};

	$: {
		let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		try {
			name = $AppProject.pages[current_page_index].name;
		} catch (e) {}
	}
</script>

<section>
	<button disabled={!($PageHistoryIndex < $PageHistory.length - 1)} on:click={navigate_backwards}>
		<i class="bx bx-left-arrow-alt" />
	</button>
	<p>{name}</p>
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
</style>
