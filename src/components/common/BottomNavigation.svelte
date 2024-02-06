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
	<!-- Home button -->
	<a
		class={`${
			$page.url.pathname.startsWith('/app/') && !$page.url.pathname.startsWith('/app/dashboard')
				? 'bg-zinc-800'
				: ''
		} ${$isEditing ? 'pointer-events-none opacity-50' : ''}`}
		href={noProjects ? '/app/dashboard' : `/app/project/${projectId}`}
	>
		<i class="bi bi-house-fill"></i>
	</a>
	<!-- Edit Button -->
	{#if $isEditing}
		<!-- Editing State -->
		<button
			on:click={() => {
				$isEditing = false;
				$TileBeingEdited = null;
			}}
			disabled={$page.url.pathname.startsWith('/app/dashboard')}
			class="flex items-center justify-center gap-4 border border-zinc-700 bg-zinc-800 text-lg"
		>
			<i class="bi bi-check-lg"></i><span>Finish Editing</span></button
		>
	{:else}
		<!-- Normal State -->
		<button
			on:click={() => {
				$isEditing = true;
			}}
			disabled={$page.url.pathname.startsWith('/app/dashboard')}
			><i class="bi bi-pencil-fill"></i></button
		>
	{/if}

	<!-- Dashboard Button -->
	<a
		href="/app/dashboard/projects"
		class={`${$page.url.pathname.startsWith('/app/dashboard') ? 'bg-zinc-800' : ''} ${
			$isEditing ? 'pointer-events-none opacity-50' : ''
		}`}><i class="bi bi-gear-fill"></i></a
	>
</div>

<style lang="postcss">
	button,
	a {
		@apply flex-1 rounded-md p-1 text-center transition-colors;
	}
</style>
