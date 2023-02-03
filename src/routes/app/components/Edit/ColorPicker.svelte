<script>
	let selectedValue = 500;
</script>

<div class="flex gap-2 items-center">
	<button
		on:click={() => {
			if (selectedValue > 100) {
				selectedValue -= 100;
			}
		}}
	>
		<i class="bi bi-dash-lg" />
	</button>
	<div class={`bg-red-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-orange-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-yellow-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-green-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-blue-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-purple-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-pink-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<div class={`bg-zinc-${selectedValue} w-[25px] h-[25px] rounded-full`} />
	<button
		on:click={() => {
			if (selectedValue < 900) {
				selectedValue += 100;
			}
		}}
	>
		<i class="bi bi-plus-lg" />
	</button>
	<small>{selectedValue}</small>
</div>
