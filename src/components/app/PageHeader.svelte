<script>
	import { ActivePage, isEditing, openModal } from '$ts/client/stores';
</script>

<div class="relative h-12 bg-zinc-900 p-2 font-light text-zinc-100">
	<p class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{$ActivePage}</p>

	{#if $isEditing}
		<div class="absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
			<button
				on:click={() => ($openModal = { name: 'edit-pages' })}
				class=" flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-1 px-2 text-sm"
			>
				<i class="bi bi-plus-lg"></i>
				<span>Add New Page</span>
			</button>
			<button
				on:click={() => ($openModal = { name: 'edit-pages' })}
				class=" flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-1 px-2 text-sm"
			>
				<i class="bi bi-pencil"></i>
				<span>Edit Pages</span>
			</button>
		</div>
	{/if}
</div>
