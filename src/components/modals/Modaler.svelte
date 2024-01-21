<script>
	import { fade } from 'svelte/transition';
	import { openModal } from '$ts/client/stores';

	import CreateProjectModal from './CreateProjectModal.svelte';
	import ManageProjectsModal from './ManageProjectsModal.svelte';
</script>

{#if $openModal.name}
	<button
		transition:fade={{ duration: 100 }}
		on:click={(e) => {
			$openModal = { name: '' };
		}}
		class="fixed left-0 top-0 z-30 grid h-screen w-screen place-items-center bg-[rgba(0,0,0,0.7)]"
	>
	</button>
{/if}

<CreateProjectModal />
<ManageProjectsModal />
