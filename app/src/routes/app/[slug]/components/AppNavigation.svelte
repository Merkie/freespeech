<div class="bottom-bar">
	<slot />
</div>

<style>
	div {
		background-color: var(--surface-1);
		border-top: 1px solid var(--surface-4);
		padding: 10px;
		display: flex;
		gap: 10px;
		position: fixed;
		width: calc(100% - 20px);
		bottom: 0;
		height: 50px;
	}
</style>
