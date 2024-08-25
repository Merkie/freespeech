<script lang="ts">
	import JSZip from 'jszip';
	import Dropzone from 'svelte-file-dropzone';
	import type { OBFPage } from '$ts/common/openboardformat';
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { cn } from '$ts/client/cn';

	export let closeModal: () => void;

	let loading = false;

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

			if (file.name.endsWith('.obz')) {
				const zip = new JSZip();

				const obzDirectory = await zip.loadAsync(file);
				const manifestFile = await obzDirectory.file('manifest.json')?.async('string');
				if (!manifestFile) return;

				const manifest = JSON.parse(manifestFile);
				if (!manifest || !manifest.root) return;

				const obfFiles = Object.keys(obzDirectory.files).filter((fileName) =>
					fileName.endsWith('.obf')
				);

				const obfFilesWithContent = await Promise.all(
					obfFiles.map(async (fileName) => {
						const file = obzDirectory.file(fileName);
						if (!file) return;
						const data = await file.async('string');
						return { fileName, data: JSON.parse(data) as any };
					})
				);

				await api.project.import.obz({
					manifest,
					obfFiles: obfFilesWithContent
				});

				await invalidateAll();

				closeModal();
			} else if (file.name.endsWith('.obf')) {
				const reader = new FileReader();
				reader.readAsText(file);
				reader.onload = async function () {
					const data = reader.result;
					const obfPage = JSON.parse(data as string) as OBFPage;

					await api.project.import.obf(obfPage);

					await invalidateAll();

					closeModal();
				};
			}

			loading = false;
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
