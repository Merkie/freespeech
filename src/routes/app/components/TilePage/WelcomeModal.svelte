<script lang="ts">
	import { fade } from 'svelte/transition';
	// import generateRandomName from '$lib/helpers/randomUsername';
	// import { CurrentProject, CurrentUser, type UserExpanded } from '$lib/stores';
	import CreateProjectInner from '../CreateProjectInner.svelte';

	let creationOption: 'new' | 'community' = 'new';
	export let callback: () => void;
	// let columns: number;
	// let rows: number;
	// let projectName: string;
	// let generatedName = generateRandomName();
	// generatedName = titleCase(
	// 	generatedName.substring(0, generatedName.length - 3).replaceAll('-', ' ')
	// );

	// function titleCase(string: string) {
	// 	var sentence = string.toLowerCase().split(' ');
	// 	for (var i = 0; i < sentence.length; i++) {
	// 		sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
	// 	}
	// 	return sentence.join(' ');
	// }

	// function randomChoice(array: any[]) {
	// 	return array[Math.floor(Math.random() * array.length)];
	// }

	// const createProject = async () => {
	// 	const response = await fetch('/api/v1/project/create', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			name: projectName || generatedName,
	// 			rows: parseInt(rows + ''),
	// 			columns: parseInt(columns + '')
	// 		})
	// 	}).then((res) => res.json());

	// 	if (!response.success) {
	// 		alert(response.message);
	// 		return;
	// 	}

	// 	$CurrentUser = {
	// 		...$CurrentUser,
	// 		projects: [...($CurrentUser!.projects || []), response.project]
	// 	} as UserExpanded;

	// 	$CurrentProject = response.project;
	// 	console.log($CurrentProject);
	// };
</script>

<main
	transition:fade={{ duration: 200 }}
	on:click={(e) => {
		// @ts-ignore
		if (e.target.tagName === '-MAIN') callback();
	}}
	on:keypress={(e) => {
		if (e.key === 'Escape') callback();
	}}
	class="fixed z-40 top-0 left-0 w-screen min-h-screen h-full bg-[rgba(0,0,0,0.5)]"
>
	<div
		class="fixed flex flex-col text-zinc-100 overflow-hidden shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-[700px] h-[500px] bg-zinc-800 border border-zinc-600 rounded-md"
	>
		<div class="p-2 w-full text-center relative">
			<button on:click={callback} class="absolute left-2 top-2">
				<i class="bi bi-x-lg" />
			</button>
			<p>Welcome to FreeSpeech AAC</p>
		</div>
		<div class="flex-1 pt-0 flex-col sm:flex-row flex">
			<div
				class="flex flex-row w-full border sm:border-0 border-x-0 border-zinc-700 sm:flex-col sm:w-fit"
			>
				<button
					on:click={() => (creationOption = 'new')}
					class={`${creationOption === 'new' ? 'bg-zinc-700' : ''} p-2 sm:text-left text-center`}
					>New Project</button
				>
				<button
					on:click={() => (creationOption = 'community')}
					class={`${
						creationOption === 'community' ? 'bg-zinc-700' : ''
					} p-2 sm:text-left text-center`}>Community Projects</button
				>
			</div>
			<div class="flex-1 bg-zinc-900 p-2 flex flex-col gap-2">
				{#if creationOption === 'new'}
					<CreateProjectInner />
				{:else}
					<div class="flex-1 grid place-items-center">
						<p>Coming soon...</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
