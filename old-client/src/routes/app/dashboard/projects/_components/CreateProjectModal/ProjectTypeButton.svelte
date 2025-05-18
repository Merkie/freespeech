<script lang="ts">
	export let title: string;
	export let icon: string;
	export let description: string;

	export let onClick: () => void = () => {};
</script>

<button
	on:click={onClick}
	class="grid w-full place-items-center rounded-lg bg-zinc-800 transition-all hover:brightness-110 active:brightness-90"
>
	<div class="flex flex-col items-center p-4 text-center text-white">
		<i class={`bi bi-${icon} mb-4 text-5xl`}></i>
		<p class="text-xl font-semibold opacity-80">{title}</p>
		<p class="text-sm opacity-60">{description}</p>
	</div>
</button>
