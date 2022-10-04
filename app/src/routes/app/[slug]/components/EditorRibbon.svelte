<script lang="ts">
	// Icons
	import { Icon } from '@steeze-ui/svelte-icon';
	import { MagicWand, Opacity, Move, Trash, Bookmark, BorderNone, Text, Dimensions, Download, SpeakerOff, Image, Rocket } from '@steeze-ui/radix-icons';

	// Stores
	import { CurrentPageIndex,
					ProjectData,
					IsEditingInspect,
					IsEditingDragging,
					IsEditingColor,
					UserTileSize,
					UserFontSize,
					EditingColorType,
					EditingTextType,
					EditingColor,
					IsEditingTrash,
					IsEditingAccent,
					IsEditingInvisible,
					IsEditingTemplate,
					IsEditingSilent,
					IsEditingNavigation,
					IsEditingImage,
					PageHistory,
					IsEditingText
					} from '$lib/stores';
	
	// API
	import { edit_page } from '$lib/api/app';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	import EditorRibbonPopout from './EditorRibbonPopout.svelte';
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

	// Disable all tools except
	const disable_all_tools_except = (tool: string) => {
		// TODO: Maybe one store for all of these?
		$IsEditingInspect = false;
		$IsEditingDragging = false;
		$IsEditingColor = false;
		$IsEditingTrash = false;
		$IsEditingAccent = false;
		$IsEditingInvisible = false;
		$IsEditingTemplate = false;
		$IsEditingText = false;
		$IsEditingSilent = false;
		$IsEditingImage = false;
		$IsEditingNavigation = false;
		isEditingCalibrate = false;

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
			case 'calibrate':
				isEditingCalibrate = true;
				break;
			case 'text':
				$IsEditingText = true;
				break;
			case 'silent':
				$IsEditingSilent = true;
				break;
			case 'image':
				$IsEditingImage = true;
				break;
			case 'navigation':
				$IsEditingNavigation = true;
				break;
		}
	}

	// State
	let isEditingCalibrate = false; 
</script>

<section>
	<div>
		<!-- <span>
			<button on:click={() => disable_all_tools_except('inspect')} class={$IsEditingInspect ? 'selected' : ''}>
				<Icon src={MagicWand} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingInspect ? '1' : '.5')}>Inspect</p>
		</span> -->
		<span>
			<button on:click={() => disable_all_tools_except('text')} class={$IsEditingText ? 'selected' : ''}>
				<Icon src={Text} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingText ? '1' : '.5')}>Text</p>
			<EditorRibbonPopout top={'-80px'} height={'auto'} visible={$IsEditingText}>
				<select bind:value={$EditingTextType}>
					<option value="display">Display Text</option>
					<option value="speak">Speak Text</option>
				</select>
			</EditorRibbonPopout>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('image')} class={$IsEditingImage ? 'selected' : ''}>
				<Icon src={Image} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingImage ? '1' : '.5')}>Image</p>
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
			<EditorRibbonPopout visible={$IsEditingColor}>
				<span style={"background-color: "+$EditingColor+";"} class="editing-color" />
				<input type="text" placeholder="color" bind:value={$EditingColor}>
				<select bind:value={$EditingColorType}>
					<option value="background">Background</option>
					<option value="border">Border</option>
					<option value="text">Text</option>
				</select>
			</EditorRibbonPopout>
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
			<button on:click={() => disable_all_tools_except('silent')} class={$IsEditingSilent ? 'selected' : ''}>
				<Icon src={SpeakerOff} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingSilent ? '1' : '.5')}>Silent</p>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('navigation')} class={$IsEditingNavigation ? 'selected' : ''}>
				<Icon src={Rocket} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingNavigation ? '1' : '.5')}>Navigation</p>
		</span>
		<span>
			<!-- TODO: Need to try and figure out a way to get the navigation parent including the page history index-->
			<button disabled={$PageHistory.length < 2} on:click={() => disable_all_tools_except('template')} class={$IsEditingTemplate ? 'selected' : ''}>
				<Icon src={Download} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingTemplate ? '1' : '.5')}>Template</p>
			<EditorRibbonPopout top={'-60px'} height={'auto'} visible={$IsEditingTemplate}>
				<p style="margin: 0; font-size: 20px;">Templating from: <b>{$PageHistory[1]}</b></p>
			</EditorRibbonPopout>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('calibrate')} class={isEditingCalibrate ? 'selected' : ''}>
				<Icon src={Dimensions} width={'25px'} />
			</button>
			<p style={'opacity: '+ (isEditingCalibrate ? '1' : '.5')}>Calibrate</p>
			<EditorRibbonPopout visible={isEditingCalibrate}>
				<span>
					<input type="text" style="width: 20px; height: 25px;" bind:this={pageColumnsInput} value={$ProjectData.pages[$CurrentPageIndex].columns} on:input={handle_columns_edit} />
					<p style="opacity: 0.5; display: block;">Columns</p>
				</span>
				<span>
					<input type="text" style="width: 20px; height: 25px;"  bind:value={$UserTileSize}  />
					<p style="opacity: 0.5; display: block;">Tile Height</p>
				</span>
				<span>
					<input type="text" style="width: 20px; height: 25px;"  bind:value={$UserFontSize} />
					<p style="opacity: 0.5; display: block;">Font size</p>
				</span>
			</EditorRibbonPopout>
		</span>
		<span>
			<button on:click={() => disable_all_tools_except('trash')} class={$IsEditingTrash ? 'selected' : ''}>
				<Icon src={Trash} width={'25px'} />
			</button>
			<p style={'opacity: '+ ($IsEditingTrash ? '1' : '.5')}>Trash</p>
			<EditorRibbonPopout top={'-60px'} visible={$IsEditingTrash} warning={true}>
				<b>Warning: You're currently in trash mode!</b>
			</EditorRibbonPopout>
		</span>

	</div>
</section>

<style>
	section {
		background: var(--editor-ribbon-background);
		border-top: 1px solid var(--editor-ribbon-border);
		position: fixed;
		bottom: 71px;
		width: fit-content;
		height: 80px;
	}

	b {
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.35));
		opacity: .8;
	}

	.selected {
		background: var(--primary);
		border-color: var(--primary-border);
		color: var(--primary-text);
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

	.editing-color {
		width: 50px;
		height: 50px;
		background: var(--editor-ribbon-button-background);
		border: 1px solid var(--editor-ribbon-button-border);
		border-radius: 5px;
		margin: 5px;
	}

	input { 
		width: 70px !important;
	}

	button:disabled {
		opacity: .5;
	}

	@media (max-width: 1200px) {
		section {
			top: 200px;
			right: 0;
			height: 100%;
		}

		div {
			flex-direction: column;
			justify-content: start;
			padding: 10px;
		}

		span p {
			display: none;
		}
	}
</style>
