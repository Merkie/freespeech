<script lang="ts">
	// Trpc
	import trpc from '$lib/client/trpc';

	// Stores
	import {
		AppProject,
		CurrentPageId,
		PageHistory,
		PageHistoryIndex,
		EditorTool,
		EditorTools,
		InEditMode,
		SelectedVoice,
		SelectedStyle
	} from '$lib/client/stores';

	// State
	let current_page_index: number;
	$: current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
	let name: string;
	$: name = $AppProject.pages[current_page_index]?.name || 'Home'; // set to home by default
	//@ts-ignore
	let StyleList =
		$AppProject.voices.find((voice) => voice.ShortName === $SelectedVoice)?.StyleList.sort() || null;
	let refreshing = false;
	let is_styles_menu_open = false;

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
	const handle_rename_page = async (new_name: string) => {
		// Prevent the user from renaming the page to 'home', this is reserved name
		if (new_name.toLowerCase() === 'home') {
			alert('Please choose a different name for this page');
			return;
		} else {
			const updated_page = await trpc(fetch).mutation('page:rename', {
				id: $CurrentPageId,
				name: new_name
			});
			if (!updated_page) return;

			$AppProject.pages = $AppProject.pages.map((page) => {
				if (page.id === updated_page.id) {
					return { ...page, name: updated_page.name };
				}
				return page;
			});
		}
	};
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
	<p
		bind:this={page_header}
		on:input={() => handle_rename_page(page_header.innerText)}
		contenteditable={name != 'Home' && $EditorTool == EditorTools.text && $InEditMode}
	>
		{name}
	</p>
	<button disabled={!($PageHistoryIndex > 0)} on:click={navigate_forwards}>
		<i class="bx bx-right-arrow-alt" />
	</button>
	{#if StyleList}
		<button on:click={() => (is_styles_menu_open = !is_styles_menu_open)} class="style-selector">
			<span class="style-name">{$SelectedStyle}</span>
			<img
				height="35px"
				width="35px"
				src={`/images/styles/${$SelectedStyle}.png`}
				alt="content face with slight smile"
			/>
			{#if is_styles_menu_open}
				<div class="style-dropdown">
					{#each StyleList.filter((item) => item != $SelectedStyle) as style}
						<button on:click={() => ($SelectedStyle = style)}>
							<img height="35px" width="35px" src={`/images/styles/${style}.png`} alt="" />
						</button>
					{/each}
				</div>
			{/if}
		</button>
	{/if}
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
		align-items: center;
	}

	p {
		min-width: 200px;
		text-align: center;
	}
	.style-selector {
		position: absolute;
		right: 20px;
		font-size: 18px;
		gap: 20px;
		display: flex;
	}
	.style-selector:hover {
		transform: none !important;
		filter: none !important;
	}
	.style-dropdown {
		position: absolute;
		top: 120%;
		z-index: 999;
		right: 0;
		width: 300px;
		padding: 20px;
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 20px;
		border-radius: 10px;
		background-color: var(--base-100);
		box-shadow: 0px 0px 5px 0px black;
		border: 1px solid var(--base-400);
	}
	.refreshing {
		animation: spin 2s linear infinite;
	}
	.refresh {
		position: absolute;
		left: 10px;
		top: 20%;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 750px) {
		p {
			min-width: 100px;
		}
	}

	@media (max-width: 500px) {
		.style-name {
			display: none;
		}
	}
</style>
