<script lang="ts">
	import { ImportingProject } from '$ts/client/stores';
	import JSZip from 'jszip';
	import ModalShell from './ModalShell.svelte';
	import Dropzone from 'svelte-file-dropzone';
	import type { OBFPage } from '$ts/common/openboardformat';
	import { invalidateAll } from '$app/navigation';

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

				await fetch('/api/v1/project/import/obz', {
					method: 'POST',
					body: JSON.stringify({
						manifest,
						obfFiles: obfFilesWithContent
					})
				});

				await invalidateAll();
			} else if (file.name.endsWith('.obf')) {
				const reader = new FileReader();
				reader.readAsText(file);
				reader.onload = async function () {
					const data = reader.result;
					const obfPage = JSON.parse(data as string) as OBFPage;

					await fetch('/api/v1/project/import/obf', {
						method: 'POST',
						body: JSON.stringify(obfPage)
					});

					await invalidateAll();
				};
			}
		});
	}
</script>

{#if $ImportingProject}
	<ModalShell closeModal={() => ($ImportingProject = false)} title="Import Project">
		<Dropzone accept={['.obz', '.obf']} multiple={false} on:drop={handleFilesSelect} />
		<ol>
			{#each files.accepted as item}
				<li>{item.name}</li>
			{/each}
		</ol>
	</ModalShell>
{/if}
