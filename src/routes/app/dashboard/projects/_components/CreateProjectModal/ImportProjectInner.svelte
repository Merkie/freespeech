<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { cn } from '$ts/client/cn';
	import { getOpenBoardFileData } from '$ts/client/handle-open-board-files';

	let loading = $state(false);

	let files: {
		accepted: File[];
		rejected: File[];
	} = {
		accepted: [],
		rejected: []
	};

	function handleFilesSelect(e: CustomEvent<File>) {
		const { acceptedFiles, fileRejections } = e.detail as unknown as {
			acceptedFiles: File[];
			fileRejections: File[];
		};
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];

		files.accepted.map(async (file) => {
			if (loading) return;
			loading = true;

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
		});
	}
</script>

<div
	class={cn(
		'rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/[50%] text-white transition-all',
		{
			'pointer-events-none opacity-50': loading
		}
	)}
>
	<Dropzone
		disableDefaultStyles={true}
		containerStyles="padding: 50px; text-align: center;"
		accept={['.obz', '.obf']}
		multiple={false}
		on:drop={handleFilesSelect}
	>
		<div class="flex flex-col items-center text-center">
			<i class="bi bi-download mb-4 text-5xl"></i>
			<p class="text-xl font-semibold">Drop your project file here</p>
			<p class="mt-1 opacity-80">or click to browse</p>
			<p class="mt-2 text-sm opacity-60">(.obz/.obf files only)</p>
		</div>
	</Dropzone>
</div>
