<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ModalShell from '$components/modals/ModalShell.svelte';
	import { cn } from '$ts/client/cn';
	import Dropzone from 'svelte-file-dropzone';
	import imageResize from 'image-resize';
	import { uploadFile } from '$ts/client/presigned-uploads';
	import api from '$ts/client/api';

	interface Props {
		isOpen: boolean;
		closeModal: () => void;
	}

	let { isOpen, closeModal }: Props = $props();

	let loading = $state(false);

	let previewBase64 = $state('');
	let previewFile: File | null = $state(null);

	async function handleFileDrop(e: CustomEvent<File>) {
		const { acceptedFiles, fileRejections } = e.detail as unknown as {
			acceptedFiles: File[];
			fileRejections: File[];
		};

		const file = acceptedFiles[0];

		if (!file) return;

		if (loading) return;
		loading = true;

		const [base64Res, blobRes] = await Promise.all([
			imageResize(file, {
				format: 'png',
				width: 640,
				outputType: 'base64'
			}),
			imageResize(file, {
				format: 'png',
				width: 640,
				outputType: 'blob'
			})
		]);

		previewBase64 = base64Res as string;
		previewFile = new File([blobRes as Blob], `profile-${Date.now()}.png`, { type: 'image/png' });

		loading = false;
	}

	async function handleFileUpload() {
		if (!previewFile) return;

		if (loading) return;
		loading = true;

		const key = await uploadFile(previewFile);

		if (!!key) {
			await api.user.update({
				profileImgUrl: `/${key}`
			});
			await invalidateAll();
			closeModal();
		}

		loading = false;
	}
</script>

{#if isOpen}
	<ModalShell {closeModal} title={'Upload Profile Picture'}>
		{#if previewBase64}
			<div class="flex items-center justify-center">
				<div class="flex flex-col items-center">
					<img
						class="h-[200px] w-[200px] rounded-full bg-white object-cover"
						src={previewBase64}
						alt="Preview"
					/>
					<button
						onclick={() => {
							previewBase64 = '';
							previewFile = null;
						}}
						class="my-2 rounded-md bg-red-500 p-2 px-4 text-sm font-semibold text-white"
					>
						<i class="bi bi-trash"></i>
						Trash
					</button>
				</div>
			</div>
			<button
				onclick={handleFileUpload}
				class="mt-4 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
			>
		{:else}
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
					accept={['image/*']}
					multiple={false}
					on:drop={handleFileDrop}
				>
					<div class="flex flex-col items-center text-center">
						<i class="bi bi-download mb-4 text-5xl"></i>
						<p class="text-xl font-semibold">Drop your file here</p>
						<p class="mt-1 opacity-80">or click to browse files</p>
						<p class="mt-2 text-sm opacity-60">(image files only)</p>
					</div>
				</Dropzone>
			</div>
		{/if}
	</ModalShell>
{/if}
