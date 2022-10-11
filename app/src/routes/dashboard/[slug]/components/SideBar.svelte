<script lang="ts">
	import { DashboardPage, DashboardPages } from '$lib/client/stores';
</script>

<div>
	<button
		class={$DashboardPage === DashboardPages.account ? 'selected' : ''}
		on:click={() => ($DashboardPage = DashboardPages.account)}
	>
		<i class="bx bx-user-circle" /> <span>Account</span></button
	>
	<button
		class={$DashboardPage === DashboardPages.projects ? 'selected' : ''}
		on:click={() => ($DashboardPage = DashboardPages.projects)}
		><i class="bx bx-grid-alt" /> <span>Projects</span></button
	>
	<button
		class={$DashboardPage === DashboardPages.uploads ? 'selected' : ''}
		on:click={() => ($DashboardPage = DashboardPages.uploads)}
		><i class="bx bx-cloud-upload" /> <span>Uploads</span></button
	>
	<button
		class={$DashboardPage === DashboardPages.advanced ? 'selected' : ''}
		on:click={() => ($DashboardPage = DashboardPages.advanced)}
		><i class="bx bx-cog" /> <span>Advanced</span></button
	>
</div>

<style>
	div {
		padding: 20px 0px;
		background: var(--base-100);
		border-right: 1px solid var(--base-400);
		width: 200px;
		height: calc(100vh - 90px);
		display: flex;
		flex-direction: column;
		gap: 5px;
		position: fixed;
	}
	button {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		font-size: 18px;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 10px;
		border-color: var(--base-300) !important;
	}
	button:hover {
		background: var(--base-200);
	}
	.selected {
		background: var(--base-200);
		border-left: 5px solid var(--primary-300) !important;
	}
	@media (max-width: 750px) {
		div {
			width: 60px;
			padding: 0;
			padding-top: 20px;
			height: calc(100vh - 70px);
		}
		span {
			display: none;
		}
		i {
			font-size: 30px;
		}
		.selected {
			border-left: 0 !important;
		}
		button:hover {
			border-left: 0 !important;
		}
		button {
			border-radius: 0;
		}
	}
</style>
