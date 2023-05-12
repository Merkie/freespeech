<span class="loader" />

<style>
	.loader {
		width: 8px;
		height: 40px;
		border-radius: 4px;
		display: block;
		margin: 20px auto;
		position: relative;
		background: currentColor;
		color: #fff;
		box-sizing: border-box;
		animation: animloader 0.3s 0.3s linear infinite alternate;
	}

	.loader::after,
	.loader::before {
		content: '';
		width: 8px;
		height: 40px;
		border-radius: 4px;
		background: currentColor;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 20px;
		box-sizing: border-box;
		animation: animloader 0.3s 0.45s linear infinite alternate;
	}
	.loader::before {
		left: -20px;
		animation-delay: 0s;
	}

	@keyframes animloader {
		0% {
			height: 48px;
		}
		100% {
			height: 4px;
		}
	}
</style>
