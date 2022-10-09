<section>
	<h1>
		<i class="bx bxs-message-square-detail" /> FreeSpeech AAC
	</h1>
	<button on:click={() => window.location.assign('/dashboard')}
		>Dashboard<i class="bx bx-right-arrow-alt" /></button
	>
</section>

<style>
	section {
		padding: 10px 20px;
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%);
		border-bottom: 1px solid var(--primary-400);
		display: flex;
		justify-content: space-between;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 5px;
		font-weight: 500;
	}

	h1 span {
		font-size: 16px;
		font-weight: 200;
		margin-top: 5px;
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
		}
	}
</style>
