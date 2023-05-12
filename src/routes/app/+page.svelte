<script lang="ts">
	import { ActivePage, ActiveProject } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import stringGate from '$ts/common/stringGate';

	onMount(() => {
		// If there is no active project, redirect to the projects page
		if (!$ActiveProject) {
			window.location.assign('/app/dashboard/projects');
		} else {
			window.location.assign(
				`/app/${stringGate($ActiveProject.name).toLowerCase()}/${
					$ActivePage ? stringGate($ActivePage).toLowerCase() : 'home'
				}`
			);
		}
	});
</script>
