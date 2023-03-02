<script>
	import { Sentence, ApplicationSettings } from '$lib/stores';

	const speak = () => {
		const utterance = new SpeechSynthesisUtterance();
		utterance.text = $Sentence.map((tile) => tile.text).join(' ');
		utterance.lang = 'en-US';
		utterance.voice = speechSynthesis.getVoices()[$ApplicationSettings.offlineVoiceIndex];
		utterance.rate = 0.75;
		speechSynthesis.speak(utterance);
	};

	const removeLastWord = () => {
		$Sentence = $Sentence.slice(0, $Sentence.length - 1);
	};
</script>

<section class="p-2 bg-zinc-100 flex">
	<button
		on:click={speak}
		on:keydown={(e) => {
			if (e.key === 'Enter') speak();
		}}
		class="flex-1 flex items-center"
	>
		{$Sentence.map((tile) => tile.text).join(' ')}
	</button>
	<button on:click={removeLastWord}>
		<img class="opacity-80" src="/clear-symbol.png" width={50} alt="" />
	</button>
</section>
