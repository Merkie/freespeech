<script lang="ts">
	import { CursorText, Image, MagicWand, Link1, Opacity, Move } from '@steeze-ui/radix-icons';

	import { Icon } from '@steeze-ui/svelte-icon';

	// Callback functions
	export let toggleInspect: Function;
	export let toggleDragging: Function;
	export let toggleColor: Function;
	export let editPageColumns: Function;

	// Editing State
	export let isEditingInspect: boolean;
	export let isEditingDragging: boolean;
	export let isEditingColor: boolean;

	// Other needed values
	export let pageColumns: number;

	// Bindings
	let pageColumnsInput: HTMLInputElement;

	const handle_columns_edit = () => {
		// Try and catch used here for empty strings and other weird non-int inputs
		try{
			if(parseInt(pageColumnsInput.value) > 0) {
				editPageColumns(parseInt(pageColumnsInput.value));
			}
		} catch(e) {}
	}
</script>

<section>
	<div>
		<span>
			<button on:click={() => toggleInspect()} class={isEditingInspect ? 'selected' : ''}>
				<Icon src={MagicWand} width={'25px'} />
			</button>
			<p style={'opacity: '+ (isEditingInspect ? '1' : '.5')}>Inspect</p>
		</span>
		<span>
			<button on:click={() => toggleDragging()} class={isEditingDragging ? 'selected' : ''}>
				<Icon src={Move} width={'25px'} />
			</button>
			<p style={'opacity: '+ (isEditingDragging ? '1' : '.5')}>Move</p>
		</span>
		<span>
			<button on:click={() => toggleColor()} class={isEditingColor ? 'selected' : ''}>
				<Icon src={Opacity} width={'25px'} />
			</button>
			<p style={'opacity: '+ (isEditingColor ? '1' : '.5')}>Color</p>
		</span>
		<span>
			<input type="text" style="width: 20px; height: 25px;" bind:this={pageColumnsInput} value={pageColumns} on:input={handle_columns_edit} />
			<p style="opacity: 0.5">Columns</p>
		</span>
	</div>
</section>

<style>
	section {
		background-color: var(--surface-1);
		border-top: 1px solid var(--surface-4);
		position: absolute;
		bottom: 71px;
		width: 100%;
		height: 80px;
	}

	.selected {
		background-color: var(--primary);
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
		max-width: 100px;
	}

	span p {
		font-size: 12px;
		margin-top: 10px;
	}

	button, input {
		display: flex;
		align-items: center;
		border: none;
		background-color: transparent;
		color: var(--text);
		background-color: var(--surface-2);
		border: 1px solid var(--surface-4);
		border-radius: 5px;
		padding: 5px;
		padding-left: 20px;
		padding-right: 20px;
		text-align: center;
		font-size: 20px;
	}
</style>
