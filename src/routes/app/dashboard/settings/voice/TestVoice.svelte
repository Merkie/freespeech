<script lang="ts">
	import { speakText } from '$ts/client/speak';
	import { VoiceEngineStatus } from '$ts/client/stores';

	let voiceTestText = $state('This is what your voice will sound like inside the application.');
</script>

<div class="mt-4 flex flex-col gap-4">
	<p class="text-3xl text-zinc-800">Test voice:</p>
	<div class="flex items-center gap-4">
		<button
			onclick={() => {
				speakText(voiceTestText);
			}}
			disabled={!['ready', 'failed'].includes($VoiceEngineStatus)}
			class={`flex w-96 items-center justify-center gap-2 rounded-md p-4 text-lg font-semibold text-white shadow-sm ${$VoiceEngineStatus === 'failed' ? 'bg-red-500' : 'bg-blue-600'}`}
			><i class="bi bi-volume-up text-xl"></i><span
				>{(() => {
					const opts = {
						ready: 'Speak',
						synthesizing: 'Synthesizing speech...',
						speaking: 'Speaking...',
						failed: 'Voice engine failed'
					};
					return opts[$VoiceEngineStatus];
				})()}</span
			></button
		>
		<div class="relative flex max-w-[700px] flex-1">
			<input
				bind:value={voiceTestText}
				type="text"
				class="flex-1 rounded-md border border-zinc-200 bg-white p-4 text-lg shadow-sm outline-none ring-blue-200 focus:ring-2"
			/>
			<p class="absolute -top-[30px] left-0 text-zinc-700">Testing sentence:</p>
		</div>
	</div>
</div>
