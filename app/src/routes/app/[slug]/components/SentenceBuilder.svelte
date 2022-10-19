<script lang="ts">
	//@ts-nocheck
	import { Sentence, SelectedVoice } from '$lib/client/stores';
	import { voices } from '$lib/client/polly';
	import trpc from '$lib/client/trpc';

	const delete_word = () => {
		Sentence.update((sentence) => {
			sentence.pop();
			return sentence;
		});
	};

	const speak_sentence = async () => {
		// If we're using an AWS voice, send a trpc request to get the audio
		if ($SelectedVoice.includes('[AWS]')) {
			let raw_sequence = $Sentence.map((tile) => tile.speak_text || tile.display_text).join(' ');
			let formatted = raw_sequence.replace(/(\r\n|\n|\r|\t)/gm, '').replaceAll('+ +', '').replaceAll(' +', ' ').replaceAll('+ ', ' ').replaceAll('+', '');
			console.log(raw_sequence);
			console.log(formatted);

			const url = await trpc(fetch).mutation('polly:synthesise', {
				text: formatted,
				voiceId: voices[$SelectedVoice]?.VoiceId,
				engine: voices[$SelectedVoice]?.Engine
			});
			if (!url) return;
			// url is base64 encoded
			let sound = new Audio(url);
			sound.play();
		} else if ($SelectedVoice.includes('[SpeechSynthesis]')) {
			// If we're using a browser voice, use the SpeechSynthesis API
			const voice = speechSynthesis
				.getVoices()
				.find((voice) => `[SpeechSynthesis] ${voice.name} ${voice.lang}` === $SelectedVoice);
			const utterance = new SpeechSynthesisUtterance(
				formatted
			);
			utterance.voice = voice;
			speechSynthesis.speak(utterance);
		}
	};
</script>

<section>
	<div on:click={speak_sentence} on:keypress={() => null}>
		{#each $Sentence as tile}
			<span>
				<p>{tile.display_text}</p>
				{#if tile.image}
					<img src={tile.image} alt="" />
				{/if}
			</span>
		{/each}
	</div>
	<button on:dblclick={() => ($Sentence = [])} on:click={delete_word}>
		<i class="bx bxs-tag-x" />
	</button>
</section>

<style>
	section {
		display: flex;
		height: 75px;
		background: var(--tiles-background);
		padding: 10px;
	}
	div {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}
	button {
		margin-top: 10px;
		font-size: 40px;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--base-100);
	}

	span {
		height: 100%;
		max-width: 50px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		color: var(--tiles-text);
	}

	img {
		width: 50%;
		object-fit: contain;
	}

	div:active {
		transform: scaleY(0.75);
		filter: brightness(1.5);
	}
</style>
