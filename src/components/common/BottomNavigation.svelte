<script lang="ts">
	import { ActivePage, ActiveProject, AppMode, Loading } from '$ts/client/stores';
	export let noProjects: boolean;

	const saveProjectToDb = async () => {
		$Loading = true;
		await fetch('/api/project/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: $ActiveProject?.id,
				pageName: $ActivePage,
				data: $ActiveProject?.pages.find((page) => page.name === $ActivePage)?.data
			})
		});
		$Loading = false;
	};
</script>

<div
	class="bg-zinc-900 text-zinc-100 font-light p-2 flex gap-2 border border-x-0 border-b-0 border-zinc-700"
>
	{#if $AppMode === 'edit'}
		<button
			on:click={async () => {
				$AppMode = 'home';
				$Loading = true;
				const project = await fetch(`/api/project/fetch/${$ActiveProject?.id}`);
				$Loading = false;
				const projectData = await project.json();
				if (projectData.error) {
					return alert(projectData.error);
				}
				$ActiveProject = projectData.project;
			}}>Cancel</button
		>
		<button
			on:click={async () => {
				await saveProjectToDb();
				$AppMode = 'home';
			}}
			class="bg-blue-600 text-blue-50 border border-blue-700">Save Changes</button
		>
	{:else}
		<button
			on:click={async () => {
				if ($AppMode === 'edit') {
					await saveProjectToDb();
				}
				$ActivePage = 'Home';
				$AppMode = 'home';
			}}
			class={$AppMode === 'home' ? 'bg-zinc-800' : ''}
			disabled={noProjects}>Home</button
		>
		<button
			on:click={() => {
				$AppMode = 'edit';
				// preEditedProject = { ...$ActiveProject };
			}}
			disabled={noProjects}>Edit</button
		>
		<button
			on:click={() => ($AppMode = 'dashboard')}
			class={$AppMode === 'dashboard' ? 'bg-zinc-800' : ''}>Dashboard</button
		>
	{/if}
</div>

<style lang="postcss">
	button {
		@apply p-1 flex-1 rounded-md;
	}
</style>
