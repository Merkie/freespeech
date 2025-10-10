<script lang="ts">
	import { run } from 'svelte/legacy';

	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';

	interface Props {
		apiKey: string;
		usePersonalElevenLabsKey: boolean;
	}

	let { apiKey, usePersonalElevenLabsKey }: Props = $props();

	let usePersonalKey = $state(usePersonalElevenLabsKey);

	let elevenLabsApiKey = $state(apiKey);
	let showKey = $state(false);

	let inputElem: HTMLInputElement = $state()!;

	run(() => {
		(async () => {
			await api.user.update({
				elevenLabsApiKey,
				usePersonalElevenLabsKey: usePersonalKey
			});
			await invalidateAll();
		})();
	});
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-4">
		<p class="text-3xl text-zinc-800">Use personal ElevenLabs key:</p>
		<button
			aria-label={`Turn ${usePersonalKey ? 'off' : 'on'} personal ElevenLabs key`}
			onclick={async () => {
				usePersonalKey = !usePersonalKey;
				await api.user.update({
					usePersonalElevenLabsKey: usePersonalKey
				});
				await invalidateAll();
			}}
			class={`relative w-[48px] scale-[120%] rounded-full p-1 shadow-sm transition-all ${usePersonalKey ? 'bg-green-500' : 'bg-zinc-300'}`}
		>
			<div
				style={`transform: translateX(${!usePersonalKey ? '0' : '100%'});`}
				class="h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all"
			></div>
		</button>
	</div>

	<p class="mt-2 max-w-[750px] text-zinc-800">
		Using a personal API key helps reduce our costs and it allows you to create custom AI voices
		based on short audio clips. Please visit <a
			class="text-blue-600 underline"
			target="_blank"
			href="https://elevenlabs.io/">ElevenLabs.io</a
		> to learn more.
	</p>
</div>

{#if usePersonalKey}
	<div class="flex flex-col gap-4">
		<p class="text-3xl text-zinc-800">ElevenLabs API Key:</p>

		<button
			onclick={async () => {
				if (showKey) return;

				showKey = true;

				await new Promise((resolve) => setTimeout(resolve, 50));

				inputElem.select();
				inputElem.setSelectionRange(elevenLabsApiKey.length, elevenLabsApiKey.length);
			}}
			class="flex max-w-[750px] items-center rounded-md border border-zinc-200 bg-white shadow-sm ring-blue-200 focus-within:ring-2"
		>
			{#if showKey}
				<input
					bind:this={inputElem}
					onblur={() => (showKey = false)}
					class="flex-1 bg-transparent p-4 text-lg outline-none"
					bind:value={elevenLabsApiKey}
					type="text"
				/>
			{:else}
				<p
					class={`text-select-none flex-1 p-4 text-left text-lg ${elevenLabsApiKey.length === 0 ? 'text-transparent' : ''}`}
				>
					{(elevenLabsApiKey || 'xxx').replaceAll(/./g, '•')}
				</p>
			{/if}
		</button>
		<p class="max-w-[750px] text-zinc-800">
			This value is encrypted and stored securely on our servers.
		</p>
	</div>
{/if}
