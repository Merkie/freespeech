<script lang="ts">
	import { OfflineVoiceUri } from '$ts/client/stores';
	import { onMount } from 'svelte';

	let offlineBrowserVoices: SpeechSynthesisVoice[] = speechSynthesis.getVoices();

	onMount(async () => {
		offlineBrowserVoices = speechSynthesis.getVoices();
		speechSynthesis.onvoiceschanged = () => {
			offlineBrowserVoices = speechSynthesis.getVoices();
		};

		await new Promise((resolve) => setTimeout(resolve, 100));

		const offlineVoicesDiv = document.getElementById('offline-voices');
		const selectedOfflineVoiceDiv = document.getElementById('offline-voice-active');

		if (selectedOfflineVoiceDiv && offlineVoicesDiv) {
			offlineVoicesDiv.scrollTo({
				top: selectedOfflineVoiceDiv.offsetTop - offlineVoicesDiv.clientHeight / 2,
				behavior: 'smooth'
			});
		}
	});
</script>

<div class="flex flex-col">
	<p class="mb-4 text-2xl text-zinc-700">Select internal device voice:</p>
	<div
		class="relative flex h-[400px] w-full flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-md"
		id="offline-voices"
	>
		{#each offlineBrowserVoices as voice, index}
			<button
				on:click={() => {
					$OfflineVoiceUri = voice.voiceURI;
				}}
				class={`group flex items-center gap-1 rounded-md p-2 px-4 hover:brightness-110 active:brightness-100 ${$OfflineVoiceUri === voice.voiceURI ? 'bg-blue-600 text-white' : `hover:bg-blue-600 hover:text-white ${index % 2 === 0 ? 'bg-zinc-100' : ''}`}`}
				id={$OfflineVoiceUri === voice.voiceURI ? 'offline-voice-active' : ''}
			>
				{voice.name}
			</button>
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
