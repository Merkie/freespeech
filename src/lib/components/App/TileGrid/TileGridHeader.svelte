<script>
	import {
		CurrentPage,
		TemplateMode,
		AppMode,
		SelectedEditModeTool,
		CurrentProject
	} from '$lib/stores';
</script>

{#if $TemplateMode.mode !== 'disabled' && $AppMode === 'edit' && $SelectedEditModeTool === 'template'}
	<section class="p-2 bg-blue-500 text-zinc-100 flex justify-center">
		<p class="capitalize font-bold text-lg">
			Editing Template "{$CurrentProject?.templates.find(
				(_template) => _template._id === $TemplateMode.templateid
			)?.name}"
		</p>
	</section>
{:else}
	<section
		class="p-2 bg-zinc-900 border border-x-0 border-zinc-700 text-zinc-100 flex justify-center"
	>
		<p class="capitalize font-bold text-lg">{$CurrentPage}</p>
	</section>
{/if}
