<script lang="ts">
	import ImportProjectInner from './ImportProjectInner.svelte';
	import { AddingProject } from '$ts/client/stores';
	import ModalShell from '$components/modals/ModalShell.svelte';
	import ProjectTypeButton from './ProjectTypeButton.svelte';
	import BlankProjectInner from './BlankProjectInner.svelte';

	let step = 'type';
</script>

{#if $AddingProject}
	<ModalShell
		closeModal={() => {
			$AddingProject = false;
			step = 'type';
		}}
		title="Create Project"
	>
		{#if step === 'type'}
			<div class="grid grid-rows-3 gap-4">
				<ProjectTypeButton
					icon="plus-square-dotted"
					title="Blank Project"
					description="Start from scratch with an empty project"
					onClick={() => (step = 'blank')}
				/>
				<ProjectTypeButton
					icon="file-earmark-code"
					title="Use Template"
					description="Choose from pre-made project templates"
				/>
				<ProjectTypeButton
					icon="file-earmark-arrow-up"
					title="Import File"
					description="Import and existing project from a file"
					onClick={() => (step = 'import')}
				/>
			</div>
		{/if}
		{#if step === 'blank'}
			<BlankProjectInner />
		{/if}
		{#if step === 'import'}
			<ImportProjectInner />
		{/if}
		{#if step === 'template'}{/if}
	</ModalShell>
{/if}
