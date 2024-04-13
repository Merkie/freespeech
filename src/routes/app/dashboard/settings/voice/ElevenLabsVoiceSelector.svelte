<script lang="ts">
	import { emojis } from '$ts/client/eleven-labs-emojis';
	import { ElevenLabsVoiceId } from '$ts/client/stores';
	import { onMount } from 'svelte';

	export let voices: {
		voice_id: string;
		name: string;
		labels: {
			accent: string;
			description: string;
			age: string;
			gender: string;
		};
	}[];

	function getEmoji(key: string, label: string) {
		const category = emojis[key as keyof typeof emojis];
		if (!category) return '';
		return category[label as keyof typeof category] || '';
	}

	function formatLabelText(label: string) {
		return label
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
			.trim();
	}

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 100));

		const elVoicesDiv = document.getElementById('el-voices');
		const selectedElVoiceDiv = document.getElementById('el-voice-active');

		if (selectedElVoiceDiv && elVoicesDiv) {
			elVoicesDiv.scrollTo({
				top: selectedElVoiceDiv.offsetTop - elVoicesDiv.clientHeight / 2,
				behavior: 'smooth'
			});
		}
	});
</script>

<div class="flex flex-col">
	<p class="mb-4 text-2xl text-zinc-700">Select ElevenLabs voice:</p>
	<div
		id="el-voices"
		class="relative flex h-[400px] w-full flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-md"
	>
		{#each voices as voice, index}
			<button
				on:click={() => {
					$ElevenLabsVoiceId = voice.voice_id;
				}}
				class={`group flex flex-wrap items-center gap-1 rounded-md p-2 px-4 hover:brightness-110 active:brightness-100 ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-600 text-white' : `hover:bg-blue-600 hover:text-white ${index % 2 === 0 ? 'bg-zinc-100' : ''}`}`}
				id={$ElevenLabsVoiceId === voice.voice_id ? 'el-voice-active' : ''}
			>
				<p class="mr-2 whitespace-nowrap text-lg font-medium">{voice.name}</p>
				{#if voice.labels.accent}
					<p
						class={`whitespace-nowrap rounded-md px-2 text-sm shadow-sm ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-700 group-hover:bg-blue-500 group-hover:text-white'}`}
					>
						{formatLabelText(voice.labels.accent)}
						{getEmoji('accent', voice.labels.accent)}
					</p>
				{/if}

				{#if voice.labels.description}
					<p
						class={`whitespace-nowrap rounded-md px-2 text-sm shadow-sm ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-700 group-hover:bg-blue-500 group-hover:text-white'}`}
					>
						{formatLabelText(voice.labels.description)}
						{getEmoji('description', voice.labels.description)}
					</p>
				{/if}

				{#if voice.labels.age}
					<p
						class={`whitespace-nowrap rounded-md px-2 text-sm shadow-sm ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-700 group-hover:bg-blue-500 group-hover:text-white'}`}
					>
						{formatLabelText(voice.labels.age)}
						{getEmoji('age', voice.labels.age)}
					</p>
				{/if}

				{#if voice.labels.gender}
					<p
						class={`whitespace-nowrap rounded-md px-2 text-sm shadow-sm ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-700 group-hover:bg-blue-500 group-hover:text-white'}`}
					>
						{formatLabelText(voice.labels.gender)}
						{getEmoji('gender', voice.labels.gender)}
					</p>
				{/if}
			</button>
		{/each}
		{#if voices.length === 0}
			<p
				class="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-center text-2xl text-zinc-500"
			>
				No voices available
			</p>
		{/if}
	</div>
</div>
