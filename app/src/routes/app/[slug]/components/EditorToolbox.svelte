<script lang="ts">
	// Icons
	import { Icon } from '@steeze-ui/svelte-icon';
	import { DotsVertical } from '@steeze-ui/radix-icons';
</script>

<div class="toolbox-handle">
	<Icon src={DotsVertical} size="50px" />
</div>

<style>
	.toolbox-handle {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0;
		height: 80px;
		width: 50px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		background-color: var(--toolbox-background);
		border: 1px solid var(--toolbox-border);
		z-index: 999;
		color: var(--toolbox-text);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
</style>
