<script lang="ts">
	import { SelectedEditModeTool } from '$lib/stores';

	const tools: { label: string; icon: string }[] = [
		{
			label: 'cursor',
			icon: 'cursor'
		},
		{
			label: 'text',
			icon: 'cursor-text'
		},
		{
			label: 'image',
			icon: 'image'
		},
		{
			label: 'color',
			icon: 'palette'
		},
		{
			label: 'accent',
			icon: 'bookmark'
		},
		{
			label: 'navigation',
			icon: 'box-arrow-in-up-right'
		}
	];
</script>

<div class="flex text-zinc-200 flex-col bg-zinc-900">
	<p class="p-1 px-4 bg-zinc-800 border border-zinc-700 border-x-0">Tools</p>
	<div class="flex flex-col pt-2 gap-4 items-center">
		{#each tools as tool}
			<button
				on:click={() => ($SelectedEditModeTool = tool.label)}
				class={`text-xl ${
					$SelectedEditModeTool === tool.label
						? 'text-zinc-100 border-zinc-600'
						: 'text-zinc-400 border-zinc-900'
				} relative group px-3 rounded-md border z-20 p-2 capitalize`}
			>
				<i class={`bi bi-${tool.icon}`} />
				<span
					class="absolute transition-opacity text-left w-min pointer-events-none group-hover:opacity-100 opacity-0 left-[50px] top-1/2 -translate-y-1/2 bg-zinc-800 rounded-md p-1 px-2 border border-zinc-700 text-sm text-zinc-200"
					>{tool.label}</span
				>
			</button>
		{/each}
	</div>
</div>
