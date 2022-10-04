<script lang="ts">
	// Icons
	import { Icon } from '@steeze-ui/svelte-icon';
	import { MagicWand, Opacity, Move, Trash, Bookmark, BorderNone, Text } from '@steeze-ui/radix-icons';

	// Stores
	import { CurrentPageIndex,
					ProjectData,
					IsEditingInspect,
					IsEditingDragging,
					IsEditingColor,
					UserTileSize,
					UserFontSize,
					EditingType,
					EditingColor,
					IsEditingTrash,
					IsEditingAccent,
					IsEditingInvisible,
					IsEditingTemplate
					} from '$lib/stores';
	
	// API
	import { edit_page } from '$lib/api/app';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();

	// Bindings
	let pageColumnsInput: HTMLInputElement;

	// Edit the columns of the page
	const edit_page_columns = async (columns: number) => {
			$ProjectData.pages[$CurrentPageIndex].columns = columns;

			if(!$session?.access_token) return;
			let page = $ProjectData.pages[$CurrentPageIndex];
			// delete page.tiles;
			await edit_page(page, $session.access_token);
	};

	// Handle the input of editing the column amount
	const handle_columns_edit = () => {
		// Try and catch used here for empty strings and other weird non-int inputs
		try{
			if(parseInt(pageColumnsInput.value) > 0) {
				edit_page_columns(parseInt(pageColumnsInput.value));
			}
		} catch(e) {}
	}

	const disable_all_tools_except = (tool: string) => {
		$IsEditingInspect = false;
		$IsEditingDragging = false;
		$IsEditingColor = false;
		$IsEditingTrash = false;
		$IsEditingAccent = false;
		$IsEditingInvisible = false;
		$IsEditingTemplate = false;

		switch(tool) {
			case 'inspect':
				$IsEditingInspect = true;
				break;
			case 'drag':
				$IsEditingDragging = true;
				break;
			case 'color':
				$IsEditingColor = true;
				break;
			case 'trash':
				$IsEditingTrash = true;
				break;
			case 'accent':
				$IsEditingAccent = true;
				break;
			case 'invisible':
				$IsEditingInvisible = true;
				break;
			case 'template':
				$IsEditingTemplate = true;
				break;
		}
	}
</script>

<section>
	<div>
		<span>
			<button on:click={() => disable_all_tools_except('inspect')} class={$IsEditingInspect ? 'selected' : ''}>
				<Icon src={MagicWand} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingInspect ? '1' : '.5')}>Inspect</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('drag')} class={$IsEditingDragging ? 'selected' : ''}>
				<Icon src={Move} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingDragging ? '1' : '.5')}>Move</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('color')} class={$IsEditingColor ? 'selected' : ''}>
				<Icon src={Opacity} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingColor ? '1' : '.5')}>Color</p>
			{#if $IsEditingColor}
				<div class="editing-color-popup">
					<span style={"background-color: "+$EditingColor+";"} class="editing-color" />
					<input type="text" placeholder="color" bind:value={$EditingColor}>
					<select bind:value={$EditingType}>
						<option value="background">Background</option>
						<option value="border">Border</option>
						<option value="text">Text</option>
					</select>
				</div>
			{/if}
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('accent')} class={$IsEditingAccent ? 'selected' : ''}>
				<Icon src={Bookmark} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingAccent ? '1' : '.5')}>Accent</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('invisible')} class={$IsEditingInvisible ? 'selected' : ''}>
				<Icon src={BorderNone} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingInvisible ? '1' : '.5')}>Invisible</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('template')} class={$IsEditingTemplate ? 'selected' : ''}>
				<Icon src={Text} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingTemplate ? '1' : '.5')}>Template</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('trash')} class={$IsEditingTrash ? 'selected' : ''}>
				<Icon src={Trash} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingTrash ? '1' : '.5')}>Trash</p>
		</span>
		<span>
			<input type="text" style="width: 20px; height: 25px;" bind:this={pageColumnsInput} value={$ProjectData.pages[$CurrentPageIndex].columns} on:input={handle_columns_edit} />
			<p style="opacity: 0.5">Columns</p>
		</span>
		<span>
			<input type="text" style="width: 20px; height: 25px;"  bind:value={$UserTileSize}  />
			<p style="opacity: 0.5">Tile Height</p>
		</span>
		<span>
			<input type="text" style="width: 20px; height: 25px;"  bind:value={$UserFontSize} />
			<p style="opacity: 0.5">Font size</p>
		</span>
	</div>
</section>

<style>
	section {
		background: var(--editor-ribbon-background);
		border-top: 1px solid var(--editor-ribbon-border);
		position: fixed;
		bottom: 71px;
		width: 100%;
		height: 80px;
	}

	.selected {
		background: var(--editor-ribbon-button-selected);
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: auto;
		padding-left: 10px;
		padding-right: 10px;
		gap: 10px;
	}

	.editing-color-popup {
		position: absolute;
		top: -90px;
		left: 20px;
		height: 70px;
		background: var(--editor-ribbon-button-background);
		border: 1px solid var(--editor-ribbon-button-border);
		border-radius: 5px;
		align-items: left;
	}

	.editing-color {
		width: 50px;
		height: 50px;
		background: var(--editor-ribbon-button-background);
		border: 1px solid var(--editor-ribbon-button-border);
		border-radius: 5px;
		margin: 5px;
	}

	span {
		display: flex;
		align-items: center;
		flex-direction: column;
		/* max-width: 100px; */
	}

	span p {
		font-size: 12px;
		margin-top: 10px;
		color: var(--editor-ribbon-button-text);
	}

	button, input, select {
		display: flex;
		align-items: center;
		border: none;
		background-color: transparent;
		color: var(--editor-ribbon-button-text);
		background: var(--editor-ribbon-button-background);
		border: 1px solid var(--editor-ribbon-button-border);
		border-radius: 5px;
		padding: 5px;
		padding-left: 20px;
		padding-right: 20px;
		text-align: center;
		font-size: 20px;
	}

	input { 
		width: 70px !important;
	}
</style>
