<script>
	import { Sentence } from '$lib/stores';
</script>

<section class="p-2 bg-zinc-100 flex">
	<div class="flex-1 flex items-center">
		{$Sentence.map((tile) => tile.text).join(' ')}
	</div>
	<button>
		<img class="opacity-80" src="/clear-symbol.png" width={50} alt="" />
	</button>
</section>
