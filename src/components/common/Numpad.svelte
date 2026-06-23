<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let maxLength = 4;
	export let masked = true;
	export let disabled = false;

	const dispatch = createEventDispatcher<{ complete: string }>();

	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	function press(digit: string) {
		if (disabled || value.length >= maxLength) return;
		value = value + digit;
		if (value.length === maxLength) dispatch('complete', value);
	}

	function backspace() {
		if (disabled) return;
		value = value.slice(0, -1);
	}
</script>

<div class="flex flex-col items-center gap-6">
	<!-- Display -->
	{#if masked}
		<div class="flex h-8 items-center gap-3">
			{#each Array.from({ length: maxLength }) as _, i}
				<div
					class={`h-4 w-4 rounded-full transition-all ${
						i < value.length ? 'scale-100 bg-zinc-100' : 'scale-90 bg-zinc-700'
					}`}
				></div>
			{/each}
		</div>
	{:else}
		<div
			class="flex h-12 min-w-[96px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-3xl font-semibold tracking-[0.3em] text-zinc-100"
		>
			{value || ' '}
		</div>
	{/if}

	<!-- Keypad -->
	<div class="grid grid-cols-3 gap-3">
		{#each keys as k}
			<button
				type="button"
				on:click={() => press(k)}
				{disabled}
				class="grid h-16 w-16 place-items-center rounded-full bg-zinc-800 text-2xl font-medium text-zinc-100 transition-all hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{k}
			</button>
		{/each}
		<div></div>
		<button
			type="button"
			on:click={() => press('0')}
			{disabled}
			class="grid h-16 w-16 place-items-center rounded-full bg-zinc-800 text-2xl font-medium text-zinc-100 transition-all hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
		>
			0
		</button>
		<button
			type="button"
			on:click={backspace}
			{disabled}
			title="Delete"
			class="grid h-16 w-16 place-items-center rounded-full text-2xl text-zinc-300 transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
		>
			<i class="bi bi-backspace"></i>
		</button>
	</div>
</div>
