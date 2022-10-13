<script lang="ts">
	import { Sentence } from '$lib/client/stores';

	const delete_word = () => {
		Sentence.update((sentence) => {
			sentence.pop();
			return sentence;
		});
	};

	const speak_sentence = () => {
		const utterance = new SpeechSynthesisUtterance(
			$Sentence.map((tile) => tile.display_text).join(' ')
		);
		speechSynthesis.speak(utterance);
	};
</script>

<section>
	<div on:click={speak_sentence}>
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
		height: 50px;
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
		font-size: 40px;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--base-100);
	}

	span {
		height: 100%;
		width: 50px;
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
