<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	// Options that display in the dropdown
	export let options: { label: string; onClick?: () => void }[];
	// The title of the dropdown
	export let title: string;
	// The selected option, left blank for "action only" dropdowns
	export let selected: string = '';

	// state if the dropdown is open/visible
	let open = false;
</script>

<div class="flex items-center">
	<!-- Tooltip title, only displayed if specified -->
	{#if selected !== ''}
		<p class="capitalize opacity-75 mr-2">{title}:</p>
	{/if}

	<!-- The displayed dropdown, contains the text, chevron icon, and the hidden dropdown menu -->
	<p
		on:click={() => (open = true)}
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				open = true;
			}
		}}
		class={`p-1 relative cursor-pointer text-sm px-2 capitalize rounded-sm bg-black border border-zinc-800`}
	>
		<!-- The text that is displayed + the icon -->
		{selected || title} <i class="bi bi-chevron-down ml-5" />
		<!-- The dropdown component, conditional, absolutely positioned -->
		{#if open}
			<div
				use:clickOutside={() => (open = false)}
				class={`p-2 z-40 ${
					selected === '' ? 'top-[40px]' : '-top-[2px] -left-[2px]'
				} text-md left-0 absolute w-max bg-black rounded-sm flex flex-col`}
			>
				{#each options as option}
					<!-- Button within the dropdown -->
					<button
						on:click={async () => {
							// wait for the animation to finish
							await new Promise((r) => setTimeout(r, 200));
							// close the dropdown
							open = false;
							// run the onClick function if it exists
							if (option.onClick) option.onClick();
							// check if the dropdown is an action only dropdown, return if it is
							if (selected === '') return;
							// set the selected option
							selected = option.label;
						}}
						class="hover:bg-blue-600 active:bg-transparent capitalize p-1 px-2 text-left rounded-sm cursor-pointer"
					>
						<!-- Button text -->
						{option.label}
						<!-- Optional checkmark if its selected -->
						{#if option.label === selected}
							<i class="pl-4 bi bi-check-lg" />
						{/if}</button
					>
				{/each}
			</div>
		{/if}
	</p>
</div>
