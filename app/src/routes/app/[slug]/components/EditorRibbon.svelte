<script lang="ts">
	import { CursorText, Image, MagicWand, Link1, Opacity, Move } from '@steeze-ui/radix-icons';

	import { Icon } from '@steeze-ui/svelte-icon';

	export let toggleInspect: Function;
	export let toggleDragging: Function;
	export let toggleColor: Function;

	export let isEditingInspect: boolean;
	export let isEditingDragging: boolean;
	export let isEditingColor: boolean;
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
	}

	span p {
		font-size: 12px;
		margin-top: 10px;
	}

	button {
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
	}
</style>
