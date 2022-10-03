<div class="bottom-bar">
	<slot />
</div>

<style>
	div {
		background: var(--app-navigation-background);
		border-top: 1px solid var(--app-navigation-border);
		padding: 10px;
		display: flex;
		gap: 10px;
		position: fixed;
		width: calc(100% - 20px);
		bottom: 0;
		height: 50px;
	}
</style>
