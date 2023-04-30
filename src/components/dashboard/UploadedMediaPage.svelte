<script lang="ts">
	import { onMount } from 'svelte';
	import { Loading } from '$ts/client/stores';

	let files: { url: string; createdAt: string; isInUse: boolean }[] = [];

	onMount(async () => {
		const response = await fetch('/api/media/all');
		const data = await response.json();
		if (data.files) {
			files = data.files;
		}
	});

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

<div class="flex items-center">
	<p class="text-3xl">Uploaded Media:</p>
	<div class="flex-1" />
	<button
		on:click={deleteAllUnusuedImages}
		class="bg-red-600 border border-red-600 rounded-md text-sm p-1 px-3 text-red-50"
		>Delete All Unused Images</button
	>
</div>
<div class="flex-1 pt-4 flex flex-col">
	<div class={`flex-1 bg-zinc-900 rounded-md flex flex-col p-2 gap-2 overflow-auto`}>
		{#each files as file, index}
			<div class={`p-2 gap-4 flex items-center ${index % 2 !== 0 ? 'bg-zinc-950' : ''}`}>
				<img src={file.url} class="w-[100px] object-contain h-[100px]" alt="preview" />
				{#if !file.isInUse}
					<div class="bg-red-600 border border-red-600 rounded-sm p-1 px-3 text-red-50">
						File not in use
					</div>
				{/if}
				<p class="text-sm flex-1 overflow-ellipsis">
					{file.url.split('/').pop()?.substring(14)}
				</p>
			</div>
		{/each}
	</div>
</div>
