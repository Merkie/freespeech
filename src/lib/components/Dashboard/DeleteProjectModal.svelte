<script lang="ts">
	import Modal from '../Modal.svelte';
	import { CurrentUser } from '$lib/stores';
	export let callback: () => void;
	export let projectid: string;

	const deleteProject = async () => {
		const response = await fetch('/api/v1/project/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: projectid
			})
		}).then((res) => res.json());
		if (!$CurrentUser) return;
		$CurrentUser = {
			...$CurrentUser,
			projects: $CurrentUser.projects.filter((item) => item._id !== projectid)
		};
		callback();
	};
</script>

<Modal {callback} title={'Are you sure you want to delete this project?'}>
	<div class="w-[500px] flex flex-col gap-2">
		<div class="flex gap-2 w-full">
			<button
				on:click={deleteProject}
				class="flex-1 bg-blue-600 border border-blue-500 rounded-md p-2"
				>Yes, delete this project</button
			>
			<button on:click={callback} class="flex-1 bg-zinc-600 border border-zinc-500 rounded-md p-2"
				>Cancel</button
			>
		</div>
	</div>
</Modal>
