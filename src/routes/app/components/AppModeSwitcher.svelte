<script lang="ts">
	import { type AppModes, AppMode, CurrentPage, CurrentProject } from '$lib/stores';

	let buttons: { label: AppModes; icon: string; disabled?: boolean; onClick?: () => void }[] = [];

	const updateProject = async () => {
		const response = await fetch('/api/v1/project/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				project: $CurrentProject
			})
		});
	};

	$: {
		buttons = [
			{
				label: 'home',
				icon: 'house',
				onClick: () => {
					$CurrentPage = 'home';
				}
			},
			{ label: 'edit', icon: 'pencil', disabled: $AppMode === 'dashboard' },
			{ label: 'dashboard', icon: 'gear' }
		];
	}
</script>

<div class="p-2 bg-zinc-900 border border-x-0 border-b-0 border-zinc-700 flex gap-2 text-zinc-100">
	{#if $AppMode !== 'edit'}
		{#each buttons as button}
			<button
				on:click={() => {
					$AppMode = button.label;
					if (button.onClick) {
						button.onClick();
					}
				}}
				disabled={button.disabled || false}
				class="capitalize p-2 bg-zinc-800 border border-zinc-700 rounded-md flex justify-center items-center gap-2 flex-1"
			>
				<i class={`bi bi-${button.icon}`} />
				<span>{button.label}</span>
			</button>
		{/each}
	{:else}
		<button
			on:click={() => ($AppMode = 'home')}
			class="capitalize p-2 bg-zinc-800 border border-zinc-700 rounded-md flex justify-center items-center gap-2 flex-1"
		>
			<i class="bi bi-x-lg" />
			Cancel
		</button>
		<button
			on:click={async () => {
				$AppMode = 'home';
				await updateProject();
			}}
			class="capitalize p-2 bg-blue-700 border border-blue-500 rounded-md flex justify-center items-center gap-2 flex-1"
		>
			<i class="bi bi-check-lg" />
			Save Changes
		</button>
	{/if}
</div>
