<script lang="ts">
	import { onMount } from 'svelte';
	import { ElevenLabsVoiceId, OfflineVoiceUri } from '$ts/client/stores';

	export let data;

	let offlineBrowserVoices: SpeechSynthesisVoice[] = speechSynthesis.getVoices();

	const labelEmojis = {
		accent: {
			american: '🇺🇸',
			'british-essex': '🇬🇧💅',
			irish: '🇮🇪',
			australian: '🇦🇺',
			british: '🇬🇧',
			'english-swedish': '🇸🇪🇬🇧',
			'american-irish': '🇺🇸🍀',
			'american-southern': '🇺🇸🌵',
			'english-italian': '🇬🇧🇮🇹',
			indian: '🇮🇳',
			african: '🌍'
		},
		description: {
			calm: '🍃',
			'well-rounded': '🟢',
			'war veteran': '🪖',
			'ground reporter': '🎤',
			strong: '💪',
			conversational: '💬',
			sailor: '⚓',
			soft: '🧸',
			casual: '👕',
			raspy: '🗣️',
			emotional: '💖',
			hoarse: '😶‍🌫️',
			shouty: '📢',
			anxious: '😟',
			pleasant: '😊',
			deep: '🌊',
			crisp: '🍎',
			seductive: '💋',
			confident: '😎',
			warm: '🌞',
			'calm ': '🍃',
			excited: '🎉',
			childlish: '🍼', // Note: Presuming "childlish" is a typo for "childish"
			whisper: '🤫',
			'raspy ': '🗣️',
			witch: '🧙‍♀️',
			foreigner: '🌏',
			childish: '🧒'
		},
		age: {
			young: '👶',
			'middle aged': '🧑‍🦳',
			old: '👴'
		},
		gender: {
			female: '♀️',
			male: '♂️'
		}
	};

	onMount(async () => {
		offlineBrowserVoices = speechSynthesis.getVoices();
		speechSynthesis.onvoiceschanged = () => {
			offlineBrowserVoices = speechSynthesis.getVoices();
		};

		await new Promise((resolve) => setTimeout(resolve, 100));

		const elVoicesDiv = document.getElementById('el-voices');
		const selectedElVoiceDiv = document.getElementById('el-voice-active');

		if (selectedElVoiceDiv && elVoicesDiv) {
			elVoicesDiv.scrollTo({
				top: selectedElVoiceDiv.offsetTop - elVoicesDiv.clientHeight / 2,
				behavior: 'smooth'
			});
		}

		const offlineVoicesDiv = document.getElementById('offline-voices');
		const selectedOfflineVoiceDiv = document.getElementById('offline-voice-active');

		if (selectedOfflineVoiceDiv && offlineVoicesDiv) {
			offlineVoicesDiv.scrollTo({
				top: selectedOfflineVoiceDiv.offsetTop - offlineVoicesDiv.clientHeight / 2,
				behavior: 'smooth'
			});
		}
	});

	function getEmoji(key: string, label: string) {
		const category = labelEmojis[key as keyof typeof labelEmojis];
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
</script>

<div class="flex flex-wrap gap-8 p-8">
	<div class="flex flex-col">
		<p class="mb-4 text-3xl text-zinc-800">ElevenLabs Voice:</p>
		<div
			id="el-voices"
			class="flex h-[400px] w-fit flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-md"
		>
			{#each data.voices as voice, index}
				<button
					on:click={() => {
						$ElevenLabsVoiceId = voice.voice_id;
					}}
					class={`group flex items-center gap-1 rounded-md p-2 px-4 hover:brightness-110 active:brightness-100 ${$ElevenLabsVoiceId === voice.voice_id ? 'bg-blue-600 text-white' : `hover:bg-blue-600 hover:text-white ${index % 2 === 0 ? 'bg-zinc-100' : ''}`}`}
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
		</div>
	</div>

	<div class="flex flex-col">
		<p class="mb-4 text-3xl text-zinc-800">Device Offline Voice:</p>
		<div
			class="flex h-[400px] w-fit flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-md"
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
		</div>
	</div>
</div>
