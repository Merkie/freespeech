<script lang="ts">
	// Props
	export let callback: Function;
	export let close_modal: Function;

	// Components
	import Modal from '$lib/client/components/Modal.svelte';
	
	// Stores
	import { GuidedAccessPin } from '$lib/client/stores';

	// State
	let pin = '';

	$: {
		if (pin.length === 4) {
			if (pin === $GuidedAccessPin) {
				callback(true);
			} else {
				pin = '';
			}
		}
	}
</script>

<Modal title="" {close_modal}>
	<h1>{pin || '-'}</h1>
	<div class="keypad">
		<button on:click={() => (pin = pin + '1')}>1</button>
		<button on:click={() => (pin = pin + '2')}>2</button>
		<button on:click={() => (pin = pin + '3')}>3</button>
		<button on:click={() => (pin = pin + '4')}>4</button>
		<button on:click={() => (pin = pin + '5')}>5</button>
		<button on:click={() => (pin = pin + '6')}>6</button>
		<button on:click={() => (pin = pin + '7')}>7</button>
		<button on:click={() => (pin = pin + '8')}>8</button>
		<button on:click={() => (pin = pin + '9')}>9</button>
		<button on:click={() => (pin = pin + '0')}>0</button>
		<button on:click={() => (pin = '')}>C</button>
		<button on:click={() => (pin = pin.slice(0, -1))}><i class="bx bxs-tag-x" /></button>
	</div>
</Modal>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(4, 1fr);
	}
	.keypad button {
		font-size: 50px;
		padding: 30px;
		background: var(--base-300);
		border-color: var(--base-400);
	}
	.keypad button:active {
		background: var(--primary-300);
	}
	h1 {
		width: calc(100% - 20px);
		background-color: white;
		color: black;
		margin-bottom: 20px;
		padding: 10px;
		border-radius: 10px;
		text-align: center;
	}
</style>
