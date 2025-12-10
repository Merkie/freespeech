<script>
	import { EnableSentenceCopyButton, EnableTileAnimations } from '$ts/client/stores';
</script>

<div class="flex flex-col gap-12 p-8 pb-[200px]">
	<div class="flex flex-col gap-8">
		<a
			href="/app/dashboard/settings"
			class="w-fit p-2 pl-0 text-xl text-zinc-600 hover:text-zinc-800"
		>
			<i class="bi bi-arrow-left-short"></i>
			<span>Back</span>
		</a>

		<p class="border-b border-zinc-300 pb-8 text-4xl text-zinc-600">Behavior Settings</p>
	</div>

	<div class="flex flex-col gap-8">
		<div class="flex items-center gap-4">
			<p class="text-3xl text-zinc-800">Display "Copy Sentence" button:</p>
			<button
				on:click={() => ($EnableSentenceCopyButton = !$EnableSentenceCopyButton)}
				class={`relative w-[48px] scale-[120%] rounded-full p-1 shadow-sm transition-all ${$EnableSentenceCopyButton ? 'bg-green-500' : 'bg-zinc-300'}`}
			>
				<div
					style={`transform: translateX(${!$EnableSentenceCopyButton ? '0' : '100%'});`}
					class="h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all"
				></div>
			</button>
		</div>

		<div class="flex items-center gap-4">
			<p class="text-3xl text-zinc-800">Enable tile animations:</p>
			<button
				on:click={() => ($EnableTileAnimations = !$EnableTileAnimations)}
				class={`relative w-[48px] scale-[120%] rounded-full p-1 shadow-sm transition-all ${$EnableTileAnimations ? 'bg-green-500' : 'bg-zinc-300'}`}
			>
				<div
					style={`transform: translateX(${!$EnableTileAnimations ? '0' : '100%'});`}
					class="h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all"
				></div>
			</button>
		</div>
	</div>
</div>
