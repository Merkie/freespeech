<script>
	import { AppProject, CurrentPageId } from '$lib/client/stores';

	let name = 'Home';

	$: {
		let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		try {
			name = $AppProject.pages[current_page_index].name;
		} catch (e) {}
	}
</script>

<section>
	<button>
		<i class="bx bx-left-arrow-alt" />
	</button>
	<p>{name}</p>
	<button disabled={true}>
		<i class="bx bx-right-arrow-alt" />
	</button>
</section>

<style>
	section {
		background-color: var(--base-100);
		border: 1px solid var(--base-400);
		border-left: none;
		border-right: none;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		font-size: 25px;
	}
	button {
		font-size: 25px;
		padding: 0px;
		background: transparent;
		border: none;
	}
</style>
