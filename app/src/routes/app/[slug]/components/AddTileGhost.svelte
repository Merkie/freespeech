<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';

	export let callback: Function;
</script>

<button on:click={() => callback()}>
	<Icon size="20px" src={Plus} />
</button>

<style>
	button {
		width: 100%;
		height: 100px;
		background-color: var(--background);
		border: 1px dashed var(--text);
		color: var(--text);
		padding: 5px;
		border-radius: 5px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}
</style>
