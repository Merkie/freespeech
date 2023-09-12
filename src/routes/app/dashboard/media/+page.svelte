<script lang="ts">
	import { onMount } from 'svelte';
	import { Loading } from '$ts/client/stores';
	import { fly, scale } from 'svelte/transition';

	export let data: {
		files: {
			url: string;
			isInUse: boolean;
		}[];
	};

	let files = data.files;

	const deleteAllUnusuedImages = async () => {
		$Loading = true;
		files.forEach(async (file) => {
			if (!file.isInUse) {
				const response = await fetch('/api/v1/media/delete', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ url: file.url })
				});
				const data = await response.json();
				if (data.success) {
					files = files.filter((f) => f.url !== file.url);
				}
			}
		});
		$Loading = false;
	};
</script>

<div class="border-b border-zinc-800 bg-zinc-950">
	<button
		on:click={deleteAllUnusuedImages}
		class="m-4 rounded-md border border-red-600 bg-red-600 p-1 px-3 text-sm text-red-50"
		>Delete All Unused Images</button
	>
</div>
{#each files as file, index}
	<div
		in:fly={{ delay: (index + 1) * 100, y: -10 }}
		class={`flex items-center gap-4 p-2 ${index % 2 !== 0 ? 'bg-zinc-950' : ''}`}
	>
		<img src={file.url} class="h-[100px] w-[100px] object-contain" alt="preview" />
		{#if !file.isInUse}
			<div class="rounded-sm border border-red-600 bg-red-600 p-1 px-3 text-red-50">
				File not in use
			</div>
		{/if}
		<p in:fly={{ x: -10 }} class="flex-1 overflow-ellipsis text-sm">
			{file.url.split('/').pop()?.substring(14)}
		</p>
	</div>
{/each}
