<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_R2_URL } from '$env/static/public';
	import api from '$ts/client/api';
	import { getOpenBoardFileData } from '$ts/client/handle-open-board-files';

	export let thumbnail: string;
	export let title: string;
	export let description: string;
	export let creatorName: string;
	export let projectDownloadLink: string;

	export let closeModal: () => void;

	async function handleUseTemplate() {
		// get the file from the download link
		const res = await fetch(PUBLIC_R2_URL + projectDownloadLink);
		const blob = await res.blob();

		// create a new file object
		const file = new File([blob], projectDownloadLink.split('/').pop() as string, {
			type: blob.type
		});

		// open the file in the editor
		const boardFile = await getOpenBoardFileData(file);

		if (boardFile?.type && boardFile?.data) {
			if (boardFile?.type === 'obz') {
				await api.project.import.obz(boardFile.data as any);
			} else {
				await api.project.import.obf(boardFile.data as any);
			}
		}

		await invalidateAll();

		// close the modal
		closeModal();
	}
</script>

<div class="rounded-lg bg-zinc-800 p-4">
	<img
		src={thumbnail}
		alt="thumbnail"
		class="mb-4 h-[200px] w-full rounded-md bg-zinc-700 object-contain p-4"
	/>
	<p class="text-2xl font-semibold">{title}</p>
	<p class="text-sm italic opacity-80">Created by {creatorName}</p>

	<p class="mt-2 opacity-60">{description}</p>

	<div class="mt-4 flex items-center">
		<button
			on:click={handleUseTemplate}
			class="flex-1 rounded-md bg-blue-500 p-2 px-4 font-semibold transition-all"
			>Use Template</button
		>
	</div>
</div>
