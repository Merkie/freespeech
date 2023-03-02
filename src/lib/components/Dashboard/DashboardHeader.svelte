<script lang="ts">
	import { CurrentUser, DashboardPage } from '$lib/stores';
	const DashboardHeaderButtons = [
		{
			name: 'library',
			icon: 'bi-grid',
			title: 'Your Library'
		},
		{
			name: 'settings',
			icon: 'bi-sliders',
			title: 'App Settings'
		},
		{
			name: 'documentation',
			icon: 'bi-book',
			title: 'Documentation'
		},
		{
			name: 'community',
			icon: 'bi-people',
			title: 'Community'
		}
	];
</script>

<section
	class="bg-zinc-900 border border-x-0 border-t-0 border-zinc-700 overflow-x-auto overflow-y-hidden sm:overflow-visible text-zinc-100 h-[70px] sm:h-[55px] px-8 flex items-center"
>
	{#each DashboardHeaderButtons as button}
		<button
			on:click={() => ($DashboardPage = button.name)}
			class="h-full px-2 whitespace-nowrap flex items-center gap-2 mr-2 hover:bg-zinc-800"
		>
			<i class={button.icon} />
			<h1>{button.title}</h1>
		</button>
	{/each}
	<div class="flex-1 min-w-[50px]" />
	<button class="flex px-2 group hover:bg-zinc-800 h-full items-center gap-2 text-zinc-50 relative">
		<div class="w-[40px] h-[40px] text-xl bg-blue-500 grid place-items-center rounded-full">
			<h1 class="capitalize  select-none">{$CurrentUser?.name?.substring(0, 1)}</h1>
		</div>
		<div
			class="absolute text-zinc-400 p-2 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 rounded-md -bottom-[50px] shadow-md text-sm whitespace-nowrap right-0 bg-zinc-900 border border-zinc-700"
		>
			Your account
		</div>
	</button>
</section>
