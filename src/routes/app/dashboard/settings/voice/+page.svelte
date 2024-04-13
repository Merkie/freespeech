<script lang="ts">
	import { EnableThirdPartyVoiceProviders } from '$ts/client/stores';
	import TestVoice from './TestVoice.svelte';
	import ElevenLabsVoiceSelector from './ElevenLabsVoiceSelector.svelte';
	import InternalVoiceSelector from './InternalVoiceSelector.svelte';

	export let data;
</script>

<div class="flex flex-col gap-12 p-8">
	<div class="flex items-center gap-4">
		<p class="text-3xl text-zinc-800">Enable third-party voice providers:</p>
		<button
			on:click={() => ($EnableThirdPartyVoiceProviders = !$EnableThirdPartyVoiceProviders)}
			class={`relative w-[48px] scale-[120%] rounded-full p-1 shadow-sm transition-all ${$EnableThirdPartyVoiceProviders ? 'bg-green-500' : 'bg-zinc-300'}`}
		>
			<div
				style={`transform: translateX(${!$EnableThirdPartyVoiceProviders ? '0' : '100%'});`}
				class="h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all"
			></div>
		</button>
	</div>

	<div
		class={`grid gap-8 transition-all ${$EnableThirdPartyVoiceProviders ? 'grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1' : 'grid-cols-1 grid-rows-1'}`}
	>
		{#if $EnableThirdPartyVoiceProviders}
			<ElevenLabsVoiceSelector voices={data.voices} />
		{/if}
		<InternalVoiceSelector />
	</div>

	<TestVoice />
</div>
