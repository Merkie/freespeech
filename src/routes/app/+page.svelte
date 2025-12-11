<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onMount(() => {
		if (!browser) return;

		const localSettingsRaw = localStorage.getItem('localSettings');
		if (localSettingsRaw) {
			try {
				const localSettings = JSON.parse(localSettingsRaw);
				const { lastVisitedProjectId, lastVisitedPageId } = localSettings;

				if (lastVisitedProjectId && lastVisitedPageId) {
					goto(`/app/project/${lastVisitedProjectId}/${lastVisitedPageId}`, { replaceState: true });
					return;
				}
			} catch {
				// Invalid JSON, fall through to default
			}
		}

		// Default: go to projects dashboard
		goto('/app/dashboard/projects', { replaceState: true });
	});
</script>

<div></div>
