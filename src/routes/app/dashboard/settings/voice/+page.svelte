<script lang="ts">
	import ElevenLabsPersonalKey from './ElevenLabsPersonalKey.svelte';
	import { EnableThirdPartyVoiceProviders } from '$ts/client/stores';
	import TestVoice from './TestVoice.svelte';
	import ElevenLabsVoiceSelector from './ElevenLabsVoiceSelector.svelte';
	import InternalVoiceSelector from './InternalVoiceSelector.svelte';

	export let data;
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

		<p class="border-b border-zinc-300 pb-8 text-4xl font-semibold text-zinc-600">Voice Settings</p>
	</div>

	<div class="flex flex-col">
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
		<p class="mt-2 max-w-[750px] text-zinc-800">
			When enabled, the selected third-party voice will be the primary voice used by the app. The
			internal voice will still be used if the third-party voice fails. Third-party voices require a
			good internet connection for best results.
		</p>
	</div>

	{#if $EnableThirdPartyVoiceProviders}
		<ElevenLabsPersonalKey
			apiKey={data.elevenLabsApiKey || ''}
			usePersonalElevenLabsKey={data.usePersonalElevenLabsKey}
		/>
	{/if}

	<div class="flex flex-col gap-4">
		<p class="text-3xl text-zinc-800">Select voice:</p>
		<div
			class={`grid gap-8 transition-all ${$EnableThirdPartyVoiceProviders ? 'grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1' : 'grid-cols-1 grid-rows-1'}`}
		>
			{#if $EnableThirdPartyVoiceProviders}
				<ElevenLabsVoiceSelector voices={data.voices} />
			{/if}
			<InternalVoiceSelector />
		</div>
	</div>

	<TestVoice />
</div>
