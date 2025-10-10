<script lang="ts">
	import { OfflineVoiceUri } from '$ts/client/stores';
	import { onMount } from 'svelte';

	let offlineBrowserVoices: SpeechSynthesisVoice[] = $state(speechSynthesis.getVoices());

	let voicesContainerElem: HTMLDivElement = $state()!;

	onMount(async () => {
		offlineBrowserVoices = speechSynthesis.getVoices();
		speechSynthesis.onvoiceschanged = () => {
			offlineBrowserVoices = speechSynthesis.getVoices();
			scrollToSelectedVoice();
		};

		scrollToSelectedVoice();
	});

	async function scrollToSelectedVoice() {
		await new Promise((resolve) => setTimeout(resolve, 100));

		const selectedOfflineVoiceDiv = document.getElementById('offline-voice-active');

		if (selectedOfflineVoiceDiv && voicesContainerElem) {
			voicesContainerElem.scrollTo({
				top: selectedOfflineVoiceDiv.offsetTop - voicesContainerElem.clientHeight / 2,
				behavior: 'smooth'
			});
		}
	}
</script>

<div class="flex flex-col">
	<p class="mb-4 text-2xl text-zinc-700">Select internal device voice:</p>
	<div
		class="relative flex h-[400px] w-full flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-md"
		bind:this={voicesContainerElem}
	>
		{#each offlineBrowserVoices as voice, index (voice.voiceURI)}
			<div
				class={`group flex items-center gap-4 rounded-md p-2 px-4 ${index % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}`}
				id={$OfflineVoiceUri === voice.voiceURI ? 'offline-voice-active' : ''}
			>
				<button
					aria-label={`Select ${voice.name} voice`}
					onclick={() => {
						$OfflineVoiceUri = voice.voiceURI;
					}}
					class="p-2"
				>
					<div
						class={`h-[20px] w-[20px] rounded-full ring-zinc-300 ring-offset-4 ${index % 2 === 0 ? 'ring-offset-zinc-100' : 'ring-offset-white'} ${$OfflineVoiceUri === voice.voiceURI ? 'bg-blue-600 ring-4' : `ring-2 ${index % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}`} transition-all`}
					></div>
				</button>
				<div class="flex flex-1 items-center gap-1">
					{voice.name}
				</div>
			</div>
		{/each}
		{#if offlineBrowserVoices.length === 0}
			<p
				class="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-center text-2xl text-zinc-500"
			>
				No voices available
			</p>
		{/if}
	</div>
</div>
