<script lang="ts">
	import CreateProjectInner from '$lib/components/CreateProjectInner.svelte';
	import Modal from '$lib/components/Modal.svelte';
	let creationOption: 'new' | 'community' = 'new';
	export let callback: () => void;
</script>

<Modal {callback} title={'Welcome to FreeSpeech'}>
	<div class="flex-1 pt-0 flex-col sm:flex-row flex">
		<div
			class="flex mr-2 rounded-md flex-row w-full border sm:border-0 border-x-0 bg-zinc-800 border-zinc-700 sm:flex-col h-fit sm:w-fit"
		>
			<button
				on:click={() => (creationOption = 'new')}
				class={`rounded-md ${
					creationOption === 'new' ? 'bg-zinc-700' : ''
				} p-2 sm:text-left text-center`}>New Project</button
			>
			<button
				on:click={() => (creationOption = 'community')}
				class={`rounded-md ${
					creationOption === 'community' ? 'bg-zinc-700' : ''
				} p-2 sm:text-left text-center`}>Community Projects</button
			>
		</div>
		<div class="sm:flex-1 bg-zinc-900 p-2 flex flex-col gap-2 w-[500px] h-[500px]">
			{#if creationOption === 'new'}
				<CreateProjectInner />
			{:else}
				<div class="flex-1 grid place-items-center">
					<p>Coming soon...</p>
				</div>
			{/if}
		</div>
	</div>
</Modal>
