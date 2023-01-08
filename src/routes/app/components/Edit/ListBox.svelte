<script lang="ts">
	let open = false;
	export let options: { label: string; onClick?: () => void }[];
	export let title: string;
	export let selected: string = '';
</script>

{#if open}
	<main
		on:click={() => (open = false)}
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				open = false;
			}
		}}
		class="fixed top-0 left-0 w-screen h-screen z-10"
	/>
{/if}
<div
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			open = false;
		}
	}}
	class="relative z-20"
>
	<p
		on:click={() => (open = true)}
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				open = true;
			}
		}}
		class={`p-1 cursor-pointer text-md px-2 border capitalize rounded-md  ${
			open ? 'bg-zinc-800 border-zinc-700' : 'border-zinc-900'
		}`}
	>
		{title} <i class="bi bi-chevron-down" />
	</p>
	{#if open}
		<div class="p-2 absolute w-max bg-zinc-900 top-[50px] rounded-md flex flex-col">
			{#each options as option}
				<button
					on:click={() => {
						if (option.onClick) option.onClick();
						if (selected === '') return;
						selected = option.label;
					}}
					class="hover:bg-zinc-800 capitalize p-2 text-left rounded-md cursor-pointer"
				>
					{option.label}
					{#if option.label === selected}
						<i class="bi bi-check-lg" />
					{/if}</button
				>
			{/each}
		</div>
	{/if}
</div>
