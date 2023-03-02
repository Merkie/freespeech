<script>
	import { EditModeColor } from '$lib/stores';
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'zinc'];
</script>

<div class="flex gap-2 items-center">
	<button
		on:click={() => {
			if ($EditModeColor.value > 100) {
				// selectedValue -= 100;
				$EditModeColor = {
					...$EditModeColor,
					value: $EditModeColor.value - 100
				};
			}
		}}
	>
		<i class="bi bi-dash-lg" />
	</button>
	{#each colors as color}
		<button
			on:click={() => {
				$EditModeColor = {
					...$EditModeColor,
					color
				};
			}}
			class={`bg-${color}-${$EditModeColor.value} w-[25px] h-[25px] rounded-full ${
				$EditModeColor.color === color ? 'ring-2 ring-zinc-100' : ''
			}`}
		/>
	{/each}
	<!-- <div class={`bg-red-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-orange-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-yellow-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-green-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-blue-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-purple-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-pink-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-zinc-${selectedValue} w-[25px] h-[25px] rounded-full`} /> -->
	<button
		on:click={() => {
			if ($EditModeColor.value < 900) {
				$EditModeColor = {
					...$EditModeColor,
					value: $EditModeColor.value + 100
				};
			}
		}}
	>
		<i class="bi bi-plus-lg" />
	</button>
	<small>{$EditModeColor.value}</small>
</div>
