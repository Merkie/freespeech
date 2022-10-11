<script lang="ts">
	export let uri: string;
	export let button_text: string;
</script>

<section>
	<h1 on:click={() => window.location.assign('/')}>
		<i class="bx bxs-message-square-detail" /> FreeSpeech AAC
	</h1>
	<button on:click={() => window.location.assign('/' + uri)}
		>{button_text}<i class="bx bx-right-arrow-alt" /></button
	>
</section>

<style>
	section {
		padding: 10px 20px;
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%);
		border-bottom: 1px solid var(--primary-400);
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: 0;
		width: calc(100% - 40px);
		z-index: 999;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 5px;
		font-weight: 500;
		cursor: pointer;
	}

	button {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	@media (max-width: 750px) {
		h1 {
			font-size: 20px;
		}

		button {
			font-size: 16px;
		}

		section {
			padding: 5px;
			width: calc(100% - 10px);
		}
	}
</style>
