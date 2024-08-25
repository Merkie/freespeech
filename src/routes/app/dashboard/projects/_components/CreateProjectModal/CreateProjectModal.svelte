<script lang="ts">
	import ImportProjectInner from './ImportProjectInner.svelte';
	import { AddingProject } from '$ts/client/stores';
	import ModalShell from '$components/modals/ModalShell.svelte';
	import ProjectTypeButton from './ProjectTypeButton.svelte';
	import BlankProjectInner from './BlankProjectInner.svelte';
	import TemplateProjectInner from './TemplateProjectInner.svelte';

	let step = 'type';

	function closeModal() {
		$AddingProject = false;
		step = 'type';
	}
</script>

{#if $AddingProject}
	<ModalShell {closeModal} title="Create Project">
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
					onClick={() => (step = 'template')}
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
			<BlankProjectInner {closeModal} />
		{/if}
		{#if step === 'template'}
			<TemplateProjectInner {closeModal} />
		{/if}
		{#if step === 'import'}
			<ImportProjectInner {closeModal} />
		{/if}
		<!-- {#if step === 'template'}{/if} -->
	</ModalShell>
{/if}
