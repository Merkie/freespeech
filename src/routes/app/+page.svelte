<script lang="ts">
	import { ActivePage, ActiveProject } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import slugify from '$ts/common/slugify';

	onMount(() => {
		// If there is no active project, redirect to the projects page
		if (!$ActiveProject) {
			window.location.assign('/app/dashboard/projects');
		} else {
			window.location.assign(
				`/app/project/${slugify($ActiveProject.name).toLowerCase()}/${
					$ActivePage ? slugify($ActivePage).toLowerCase() : 'home'
				}`
			);
		}
	});
</script>
