<script lang="ts">
	import { create_object } from '$lib/api/aws';
	export let data;
	let files: FileList;

	export const handle_upload = async () => {
		const response = await create_object(files[0]);
		// const { url } = await response.json();
	};
</script>

<input bind:files type="file" />
<button on:click={handle_upload}>Click me</button>

<h1>Settings</h1>
