<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';

	export let keyIsSet: boolean;
	export let keyLast4: string;
	export let usePersonalElevenLabsKey: boolean;

	let usePersonalKey = usePersonalElevenLabsKey;

	let newKey = '';
	let saving = false;
	let error = '';

	const saveKey = async (elevenLabsApiKey: string | null) => {
		if (saving) return;
		saving = true;
		error = '';

		try {
			await api.user.update({ elevenLabsApiKey });
			newKey = '';
			await invalidateAll();
		} catch {
			error = 'The key could not be saved. Please try again.';
		}

		saving = false;
	};
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-4">
		<p class="text-3xl text-zinc-800">Use personal ElevenLabs key:</p>
		<button
			on:click={async () => {
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

		{#if keyIsSet}
			<div class="flex max-w-[750px] items-center gap-4">
				<p class="flex-1 text-lg text-zinc-800">
					Saved key{keyLast4 ? ` ending in ${keyLast4}` : ''}
				</p>
				<button
					on:click={() => saveKey(null)}
					disabled={saving}
					class="rounded-md border border-red-300 bg-white p-2 px-4 text-red-600 hover:bg-red-50 disabled:opacity-50"
					>Remove key</button
				>
			</div>
		{/if}

		<form
			on:submit|preventDefault={() => newKey.trim() && saveKey(newKey.trim())}
			class="flex max-w-[750px] items-center gap-2"
		>
			<input
				bind:value={newKey}
				type="password"
				autocomplete="off"
				placeholder={keyIsSet ? 'Enter a new key to replace it' : 'Enter your ElevenLabs API key'}
				class="flex-1 rounded-md border border-zinc-200 bg-white p-4 text-lg shadow-sm outline-none ring-blue-200 focus:ring-2"
			/>
			<button
				type="submit"
				disabled={saving || !newKey.trim()}
				class="rounded-md border border-blue-400 bg-blue-500 p-4 px-6 text-lg text-blue-50 disabled:opacity-50"
				>Save</button
			>
		</form>

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}

		<p class="max-w-[750px] text-zinc-800">
			This value is encrypted and stored securely on our servers.
		</p>
	</div>
{/if}
