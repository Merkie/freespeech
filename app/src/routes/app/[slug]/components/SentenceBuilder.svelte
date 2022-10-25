<script lang="ts">
	// Stores
	import { Sentence, SelectedVoice, SelectedStyle } from '$lib/client/stores';

	// Trpc
	import trpc from '$lib/client/trpc';

	// Handles deleting a word from the sentence
	const delete_word = () => {
		Sentence.update((sentence) => {
			sentence.pop();
			return sentence;
		});
	};

	// Speaks sentence to the client
	// handles offline and online voices
	const speak_sentence = async () => {
		let raw_sequence = $Sentence.map((tile) => tile.speak_text || tile.display_text).join(' ');
		let formatted = raw_sequence
			.replace(/(\r\n|\n|\r|\t)/gm, '')
			.replaceAll('+ +', '')
			.replaceAll(' +', ' ')
			.replaceAll('+ ', ' ')
			.replaceAll('+', '');

		if ($SelectedVoice.includes('[Offline]')) {
			// If we're using a browser voice, use the SpeechSynthesis API
			const voice = speechSynthesis
				.getVoices()
				.find((voice) => `[Offline] ${voice.name} ${voice.lang}` === $SelectedVoice);
			const utterance = new SpeechSynthesisUtterance(formatted);
			utterance.voice = voice;
			speechSynthesis.speak(utterance);
			return;
		}

		const url = await trpc(fetch).mutation('tts:azure_tts', {
			voice: $SelectedVoice,
			style: $SelectedStyle,
			text: formatted
		});
		if (!url) return;
		let sound = new Audio(url);
		sound.play();
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
