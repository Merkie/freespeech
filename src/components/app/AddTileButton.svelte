<script lang="ts">
	export let x: number;
	export let y: number;
</script>

<button
	style={`grid-row: ${y + 1}; grid-column: ${x + 1};`}
	class={`grid h-full w-full place-items-center rounded-md border border-dashed border-zinc-500 bg-zinc-100 text-3xl font-light text-zinc-500`}
>
	<p>+</p>
</button>
