<script lang="ts">
	import generateRandomName from '$lib/helpers/randomUsername';
	import { CurrentProject, CurrentUser } from '$lib/stores';
	import type { UserExpanded } from '$lib/types';

	let columns: number = 8;
	let rows: number = 6;
	let projectName: string;
	let generatedName = generateRandomName();
	let creatingProject = false;

	generatedName = titleCase(
		generatedName.substring(0, generatedName.length - 3).replaceAll('-', ' ')
	);

	function titleCase(string: string) {
		var sentence = string.toLowerCase().split(' ');
		for (var i = 0; i < sentence.length; i++) {
			sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
		}
		return sentence.join(' ');
	}

	function randomChoice(array: any[]) {
		return array[Math.floor(Math.random() * array.length)];
	}

	const createProject = async () => {
		creatingProject = true;
		const response = await fetch('/api/v1/project/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: projectName || generatedName,
				rows: parseInt(rows + ''),
				columns: parseInt(columns + '')
			})
		}).then((res) => res.json());

		if (!response.success) {
			alert(response.message);
			return;
		}

		$CurrentUser = {
			...$CurrentUser,
			projects: [...($CurrentUser!.projects || []), response.project]
		} as UserExpanded;

		$CurrentProject = response.project;
	};
</script>

<p class="text-zinc-200">Project Name:</p>
<div class="w-full rounded-md px-2 p-1 bg-zinc-300 text-zinc-600 border border-zinc-400 flex">
	<input
		type="text"
		placeholder={generatedName}
		bind:value={projectName}
		class="outline-none h-full flex-1 bg-transparent border-none"
	/>
	<button
		on:click={() => {
			generatedName = generateRandomName();
			generatedName = titleCase(
				generatedName.substring(0, generatedName.length - 3).replaceAll('-', ' ')
			);
		}}
	>
		<i class="bi bi-dice-3" />
	</button>
</div>

<p>Dimensions:</p>
<div class="flex gap-2 items-center">
	<input
		placeholder="Columns"
		bind:value={columns}
		type="number"
		class="bg-zinc-800 min-w-[0px] p-1 px-2 rounded-md outline-none flex-1 border-none"
	/>
	<i class="bi bi-x-lg" />
	<input
		placeholder="Rows"
		bind:value={rows}
		type="number"
		class="bg-zinc-800 min-w-[0px] p-1 px-2 rounded-md outline-none flex-1 border-none"
	/>
</div>
<p>Preview:</p>
<div class="flex-1 flex-col flex rounded-md shadow-md">
	<div class="h-[30px] bg-zinc-100 text-zinc-900 rounded-t-md flex justify-end">
		<button>
			<img width={20} class="mr-2" src="/clear-symbol.png" alt="" />
		</button>
	</div>
	<div class="h-[10px] bg-zinc-800" />
	<div
		style={`grid-template-columns: repeat(${columns || 0}, 1fr); grid-template-rows: repeat(${
			rows || 0
		}, 1fr);`}
		class={`flex-1 rounded-b-md bg-zinc-200 grid gap-1 p-1`}
	>
		{#each Array.from({ length: columns * rows }, (_, i) => i + 1) as item}
			<button
				class="w-full overflow-hidden relative h-full flex flex-col justify-center text-center items-center text-zinc-600 rounded-sm bg-zinc-100 border border-zinc-300 shadow-sm"
			>
				{#if randomChoice([false, false, false, true])}
					<div class="absolute w-[40px] h-[40px] rotate-45 -top-[30px] -right-[30px] bg-zinc-600" />
				{/if}
				<i
					style="font-size: 0.6rem"
					class={`bi absolute bi-${randomChoice(['square-fill', 'triangle-fill', 'circle-fill'])}`}
				/>
			</button>
		{/each}
	</div>
</div>
<button
	disabled={creatingProject}
	on:click={createProject}
	class="bg-blue-600 border border-blue-500 rounded-md p-2">Create Project</button
>
