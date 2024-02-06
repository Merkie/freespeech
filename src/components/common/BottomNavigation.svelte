<script lang="ts">
	import { isEditing, TileBeingEdited } from '$ts/client/stores';
	import { page } from '$app/stores';

	export let noProjects: boolean;
	export let projectId: string;
</script>

<!-- TODO: This wont display in new versions of safari -->
<div
	class="flex gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] font-light text-zinc-100"
>
	{#if $isEditing}
		<!-- Cancel Edits Button -->
		<button
			on:click={async () => {
				$isEditing = false;
				$TileBeingEdited = null;
			}}>Cancel</button
		>
		<!-- Save Edits Button -->
		<button
			on:click={async () => {
				$isEditing = false;
				$TileBeingEdited = null;
			}}
			class="border border-blue-700 bg-blue-600 text-blue-50">Save Changes</button
		>
	{:else}
		<!-- Home button -->
		<a
			class={`${
				$page.url.pathname.startsWith('/app/') && !$page.url.pathname.startsWith('/app/dashboard')
					? 'bg-zinc-800'
					: ''
			}`}
			href={noProjects ? '/app/dashboard' : `/app/project/${projectId}`}
		>
			<i class="bi bi-house-fill"></i>
		</a>
		<!-- Edit Button -->
		<button
			on:click={() => {
				$isEditing = true;
			}}
			disabled={noProjects || $page.url.pathname.startsWith('/app/dashboard')}
			><i class="bi bi-pencil-fill"></i></button
		>
		<!-- Dashboard Button -->
		<a
			href="/app/dashboard/projects"
			class={$page.url.pathname.startsWith('/app/dashboard') ? 'bg-zinc-800' : ''}
			><i class="bi bi-gear-fill"></i></a
		>
	{/if}
</div>

<style lang="postcss">
	button,
	a {
		@apply flex-1 rounded-md p-1 text-center transition-colors;
	}
</style>
