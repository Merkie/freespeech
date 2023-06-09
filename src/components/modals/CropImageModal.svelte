<script>
	//@ts-nocheck
	import { CROP_STATE, ImageCrop } from '@novacbn/svelte-image-crop';
	import ModalShell from './ModalShell.svelte';

	export let handleImageChange;
	export let handleNavigateBack;
	export let image;

	let blob;
	let image_crop;

	const DEFAULT_IMAGE_SRC = image;
	let src = DEFAULT_IMAGE_SRC;
	let state = CROP_STATE.default;

	async function on_commit_click(event) {
		// Using our `ImageCrop` Component binding, we can access its `get_cropped_blob`. And use
		// that to cache the current crop selection as a new `Blob` with image data. Then tell the
		// Browser to create a disposable URL pointing to the blob to display
		//
		// And if the currently loaded image doesn't match our default, we need to destroy the
		// disposable URL to prevent memory leaks

		blob = await image_crop.get_cropped_blob();

		const base64data = await blob.arrayBuffer().then((buffer) => {
			return btoa(
				new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		});

		const response = await fetch('/api/v1/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: 'cropped-image.png',
				base64data
			})
		});

		const data = await response.json();

		if (data.fileurl) {
			handleImageChange(data.fileurl);
			handleNavigateBack();
		}
	}
	function on_clear_click(event) {
		// Next, we can use the `reset` method to remove the current crop selection

		image_crop.reset();
	}

	function on_reset_click(event) {
		// Finally we can reset everything to defaults to start over with the original image.
		if (src !== DEFAULT_IMAGE_SRC) URL.revokeObjectURL(src);

		blob = null;
		src = DEFAULT_IMAGE_SRC;

		image_crop.reset();
	}

	function on_state(event) {
		// For disabling our controls, we need to locally cache any changes to the `ImageCrop`'s state
		state = event.detail.state;
	}
</script>

<ModalShell title="Crop Image">
	<ImageCrop bind:this={image_crop} {src} on:state={on_state} />
	<div class="flex gap-2">
		<button
			class="mt-2 flex-1 rounded-md border border-zinc-600 bg-zinc-700 p-1 text-zinc-50"
			disabled={src === DEFAULT_IMAGE_SRC}
			on:click={on_reset_click}
		>
			Reset
		</button>
		<button
			class="mt-2 flex-1 rounded-md border border-zinc-600 bg-zinc-700 p-1 text-zinc-50"
			disabled={state === CROP_STATE.default}
			on:click={on_clear_click}
		>
			Clear
		</button>
		<button
			class="mt-2 flex-1 rounded-md border border-blue-500 bg-blue-600 p-1 text-blue-50"
			disabled={state === CROP_STATE.default}
			on:click={on_commit_click}
		>
			Submit
		</button>
	</div>
</ModalShell>
