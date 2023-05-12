<script lang="ts">
	import {
		ActivePage,
		ActiveProject,
		hasUnsavedChanges,
		isEditing,
		Loading
	} from '$ts/client/stores';
	import stringGate from '$ts/common/stringGate';
	export let noProjects: boolean;
	export let path: string;

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
	class="bg-zinc-900 text-zinc-100 font-light p-2 flex gap-2 border border-x-0 border-b-0 border-zinc-700 pb-12 sm:pb-2"
>
	{#if $isEditing}
		<!-- Cancel Edits Button -->
		<button
			on:click={async () => {
				// Set isEditing to false to change the ui state
				$isEditing = false;
				// If there are no unsaved changes, return
				if (!$hasUnsavedChanges) return;
				// Fetch the project from the db to reset the data
				$Loading = true;
				const project = await fetch(`/api/project/fetch/${$ActiveProject?.id}`);
				$Loading = false;
				const projectData = await project.json();
				// Error handling
				if (projectData.error) {
					return alert(projectData.error);
				}
				// Set project to the fetched project
				$ActiveProject = projectData.project;
				// Set hasUnsavedChanges to false to reset the state
				$hasUnsavedChanges = false;
			}}>Cancel</button
		>
		<!-- Save Edits Button -->
		<button
			on:click={async () => {
				await saveProjectToDb();
				$isEditing = false;
				// Set hasUnsavedChanges to false to reset the state
				$hasUnsavedChanges = false;
			}}
			class="bg-blue-600 text-blue-50 border border-blue-700">Save Changes</button
		>
	{:else}
		<!-- Home button -->
		<a
			on:click={async () => {
				if ($isEditing) {
					await saveProjectToDb();
				}
				$ActivePage = 'Home';
				$isEditing = false;
				if (!$ActiveProject) return;
			}}
			class={path.startsWith('/app/') && !path.startsWith('/app/dashboard') ? 'bg-zinc-800' : ''}
			href={$ActiveProject
				? `/app/${stringGate(($ActiveProject || { name: '' }).name).toLowerCase()}/home`
				: ''}
		>
			Home
		</a>
		<!-- Edit Button -->
		<button
			on:click={() => {
				$isEditing = true;
			}}
			disabled={noProjects || path.startsWith('/app/dashboard')}>Edit</button
		>
		<!-- Dashboard Button -->
		<a href="/app/dashboard/projects" class={path.startsWith('/app/dashboard') ? 'bg-zinc-800' : ''}
			>Dashboard</a
		>
	{/if}
</div>

<style lang="postcss">
	button,
	a {
		@apply p-1 flex-1 rounded-md text-center;
	}
</style>
