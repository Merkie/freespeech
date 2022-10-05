<script lang="ts">
	import { create_object } from '$lib/api/aws';
	import type { Project } from '@prisma/client';
	export let project: Project;
	export let updateProjectCallback: Function;
	export let closeModalCallback: Function;

	let name = project.name;
	let description = project.description;
	let image = project.image;

	let files: FileList;

	export const handle_upload = async (file: File) => {
		const response = await create_object(file);
		image = response.url;
	};

	$: {
		updateProjectCallback({
			name,
			description,
			image
		});
	}
</script>

<div>
	<span
		><h4>Inspector</h4>
		<button class="close" on:click={() => closeModalCallback()}>Close</button></span
	>
	<p>Project Name:</p>
	<input type="text" bind:value={name} />
	<p>Project Description (Optional):</p>
	<input type="text" bind:value={description} />
	<p>Image (optional):</p>
	<input type="text" bind:value={image} />
	<input bind:files type="file" />
	<button class="upload" on:click={() => handle_upload(files[0])}>Upload</button>
</div>

<style>
	div {
		position: absolute;
		z-index: 999;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		background: var(--editor-modal-background);
		border: 1px solid var(--editor-modal-border);
		color: var(--editor-modal-text);
		border-radius: 10px;
		max-width: 500px;
		display: flex;
		gap: 10px;
		flex-direction: column;
		box-shadow: 0 0 0 100000px rgba(0, 0, 0, 0.5);
		font-size: 20px;
	}

	span {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close {
		background-color: var(--failure);
		border: 1px solid var(--failure-border);
		border-radius: 5px;
		padding: 5px;
		font-size: 15px;
		cursor: pointer;
		color: var(--text);
	}

	div * {
		font-size: 20px;
	}

	input {
		background-color: var(--editor-modal-input-background);
		color: var(--editor-modal-input-text);
		border: 1px solid var(--editor-modal-input-border);
		padding: 10px;
		border-radius: 5px;
	}

	.upload {
		background-color: var(--upload-button-background);
		color: var(--upload-button-text);
		border: 1px solid var(--upload-button-border);
		padding: 10px;
		border-radius: 5px;
	}
</style>
