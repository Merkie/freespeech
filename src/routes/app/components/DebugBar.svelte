<script lang="ts">
	import { CurrentProject, CurrentUser, CurrentPage } from '$lib/stores';
</script>

<div class="bg-blue-600 font-mono text-blue-50 text-sm p-1 flex gap-1">
	<i class="bi bi-person-circle" />
	<b>USER:{' '}</b>
	<p class="italic">{$CurrentUser?.name}</p>
	<i class="bi bi-house-gear" />
	<b>PROJECT:{' '}</b>
	<p class="italic">{$CurrentProject?.name}</p>
	<i class="bi bi-file-earmark-text" />
	<b>PAGE:{' '}</b>
	<p class="italic">{$CurrentPage}</p>
</div>
