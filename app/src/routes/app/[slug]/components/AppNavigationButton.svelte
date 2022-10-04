<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { IconSource } from '@steeze-ui/svelte-icon/types';
	export let iconsrc: IconSource; // src of icon
	export let name: string; // name of button
	export let background: string = ''; // background color of button
	export let border: string = ''; // border color of button
	export let callback: Function; // onclick
</script>

<button style={`background-color: ${background}; border-color: ${border}`} on:click={() => callback()}>
	<span>
		<Icon size="18px" src={iconsrc} theme="solid" />
	</span>
	<span>{name}</span>
</button>

<style>
	button {
		background: var(--app-navigation-button-background);
		border: 1px solid var(--app-navigation-button-border);
		color: var(--app-navigation-button-text);
		padding: 5px;
		border-radius: 5px;
		flex: 1;
		font-size: 20px;
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}

	span {
		display: flex;
		align-items: center;
	}
</style>
