<script lang="ts">
	import { ArrowsExpand } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let toggleDragging: Function;
	export let isEditingDragging: boolean;
</script>

<section>
	<div>
		<span>
			<button on:click={() => toggleDragging()} class={isEditingDragging ? 'selected' : ''}>
				<Icon src={ArrowsExpand} width={'25px'} />
			</button>
			<p style={'opacity: '+ (isEditingDragging ? '1' : '.5')}>Move</p>
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
		height: 100%;
		width: auto;
		padding-left: 10px;
		padding-right: 10px;
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
		padding: 5px;
		border-radius: 5px;
	}
</style>
