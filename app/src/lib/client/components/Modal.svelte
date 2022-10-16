<script lang="ts">
	import Spinner from "./Spinner.svelte";
	export let title: string;
  export let close_modal: Function;
	export let loading: boolean = false;
</script>

<div>
  <h1>{title}</h1>
  <slot />
	<div style={`pointer-events: none; opacity: ${loading ? '1' : '0'}`} class="spinner">
		<Spinner />
	</div>
</div>
<main on:click={() => close_modal()} on:keypress={() => null} />

<style>
  main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999999;
  }

	div {
		padding: 20px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(500px, 80%) !important;
    background: var(--base-100);
		border-radius: 10px;
		border: 1px solid var(--base-400);
		z-index: 99999999;
	}

	div * {
		width: calc(100% - 35px);
	}

	.spinner {
		all: unset;
		width: fit-content !important;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
