<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_R2_URL } from '$env/static/public';
	import api from '$ts/client/api';
	import { cn } from '$ts/client/cn';
	import { getOpenBoardFileData } from '$ts/client/handle-open-board-files';

	interface Props {
		thumbnail: string;
		title: string;
		description: string;
		creatorName: string;
		projectDownloadLink: string;
	}

	let { thumbnail, title, description, creatorName, projectDownloadLink }: Props = $props();

	let loading = $state(false);

	async function handleUseTemplate() {
		if (loading) return;
		loading = true;

		// get the file from the download link
		const res = await fetch(PUBLIC_R2_URL + projectDownloadLink);
		const blob = await res.blob();

		// create a new file object
		const file = new File([blob], projectDownloadLink.split('/').pop() as string, {
			type: blob.type
		});

		// open the file in the editor
		const boardFile = await getOpenBoardFileData(file);

		let createdProjectId = '';

		if (boardFile?.type && boardFile?.data) {
			if (boardFile?.type === 'obz') {
				const importObzResponse = await api.project.import.obz(boardFile.data as any);

				if (importObzResponse.projectId) {
					await api.project.updateThumbnail(importObzResponse.projectId);
					createdProjectId = importObzResponse.projectId;
				}
			} else {
				const importObfResponse = await api.project.import.obf(boardFile.data as any);

				if (importObfResponse.projectId)
					await api.project.updateThumbnail(importObfResponse.projectId);
				createdProjectId = importObfResponse.projectId;
			}
		}

		if (createdProjectId) {
			window.location.assign(`/app/project/${createdProjectId}`);
		} else {
			loading = false;
			await invalidateAll();
		}
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
			onclick={handleUseTemplate}
			class={cn('flex-1 rounded-md bg-blue-500 p-2 px-4 font-semibold transition-all', {
				'pointer-events-none opacity-50': loading
			})}>{loading ? 'Creating Project...' : 'Use Template'}</button
		>
	</div>
</div>
