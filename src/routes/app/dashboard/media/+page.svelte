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
				const response = await fetch('/api/media/delete', {
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

<div class="bg-zinc-950 border-b border-zinc-800">
	<button
		on:click={deleteAllUnusuedImages}
		class="bg-red-600 border border-red-600 rounded-md text-sm p-1 px-3 text-red-50 m-4"
		>Delete All Unused Images</button
	>
</div>
{#each files as file, index}
	<div
		in:fly={{ delay: (index + 1) * 100, y: -10 }}
		class={`p-2 gap-4 flex items-center ${index % 2 !== 0 ? 'bg-zinc-950' : ''}`}
	>
		<img src={file.url} class="w-[100px] object-contain h-[100px]" alt="preview" />
		{#if !file.isInUse}
			<div class="bg-red-600 border border-red-600 rounded-sm p-1 px-3 text-red-50">
				File not in use
			</div>
		{/if}
		<p in:fly={{ x: -10 }} class="text-sm flex-1 overflow-ellipsis">
			{file.url.split('/').pop()?.substring(14)}
		</p>
	</div>
{/each}
