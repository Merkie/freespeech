<script lang="ts">
	export let warning = false;
	export let height: string = '';
	export let top: string = '';
	export let visible: boolean;
	let element: HTMLElement;

	import { IsInEditMode } from '$lib/stores';
</script>

<section style={`};
								 opacity: ${visible && $IsInEditMode ? '1' : '0'};
								 pointer-events: ${visible ? 'auto' : 'none'};
								 ${height ? 'height: '+height+';' : ''}
								 left: ${visible && $IsInEditMode ? '10px' : '-100px'};
								 `} bind:this={element} class={`${warning ? 'warning' : ''}`}>
	{#if warning}
		<div class="warning-bg" />
	{/if}
  <slot />
</section>

<style>
  section {
		position: fixed;
		bottom: 80px !important;
		height: 70px;
		display: flex;
		background: var(--editor-ribbon-background);
		border: 1px solid var(--editor-ribbon-button-border);
		border-radius: 5px;
		align-items: center;
		gap: 20px;
		padding: 10px;
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.35));
		overflow: hidden;
	}

	.warning {
		height: auto;
		/* top: -70px; */
		background-color: var(--warning);
		border: 1px solid var(--warning-border);
		color: var(--warning-text);
	}

	.warning-bg {
		z-index: -1;
		background: repeating-linear-gradient(
			45deg,
			var(--warning),
			var(--warning) 10px,
			var(--warning-border) 10px,
			var(--warning-border) 20px
		);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>