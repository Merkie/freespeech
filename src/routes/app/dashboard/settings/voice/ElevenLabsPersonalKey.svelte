<script lang="ts">
	import { UsePersonalElevenLabsKey } from '$ts/client/stores';

	export let apiKey: string;

	let elevenLabsApiKey = apiKey;
	let showKey = false;

	$: {
		fetch('/api/v1/user/update', {
			method: 'POST',
			body: JSON.stringify({ elevenLabsApiKey })
		});
	}
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-4">
		<p class="text-3xl text-zinc-800">Use personal ElevenLabs key:</p>
		<button
			on:click={() => ($UsePersonalElevenLabsKey = !$UsePersonalElevenLabsKey)}
			class={`relative w-[48px] scale-[120%] rounded-full p-1 shadow-sm transition-all ${$UsePersonalElevenLabsKey ? 'bg-green-500' : 'bg-zinc-300'}`}
		>
			<div
				style={`transform: translateX(${!$UsePersonalElevenLabsKey ? '0' : '100%'});`}
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

{#if $UsePersonalElevenLabsKey}
	<div class="flex flex-col gap-4">
		<p class="text-3xl text-zinc-800">ElevenLabs API Key:</p>

		<div
			class="flex items-center rounded-md border border-zinc-200 bg-white shadow-sm ring-blue-200 focus-within:ring-2"
		>
			{#if showKey}
				<input
					class="flex-1 bg-transparent p-4 text-lg outline-none"
					bind:value={elevenLabsApiKey}
					type="text"
				/>
			{:else}
				<input
					class="flex-1 bg-transparent p-4 text-lg outline-none"
					bind:value={elevenLabsApiKey}
					type="password"
				/>
			{/if}

			<button
				on:click={() => {
					showKey = !showKey;
				}}
				class="scale-[120%] p-4 pr-6 text-xl text-neutral-500"
			>
				<i class={`bi bi-eye-${showKey ? 'slash-' : ''}fill`}></i>
			</button>
		</div>
		<p class="max-w-[750px] text-zinc-800">
			This value is encrypted and stored securely on our servers.
		</p>
	</div>
{/if}
