<h1>Account</h1>
<div>
	<img
		src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg"
		alt="profile"
		class="profile"
	/>
	<span class="name-email">
		<h3>Linus Torvalds</h3>
		<p>linus@freespeechaac.com</p>
		<p class="organization"><i class="bx bx-buildings" /> CyFair-ISD</p>
	</span>
</div>

<label for="">Name:</label>
<input type="text" placeholder="Linus Torvalds" />

<label for="">Email:</label>
<input type="text" placeholder="linustorvalds@freespeechaac.com" />

<button>Change my password</button>

<style>
	h1 {
		margin-bottom: 20px;
	}
	.profile {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 50%;
		border: 4px solid var(--base-400);
	}
	div {
		display: flex;
		align-items: center;
		gap: 20px;
		background-color: var(--base-100);
		padding: 20px;
		border-radius: 10px;
		border: 1px solid var(--base-400);
		filter: var(--shadow);
		width: fit-content;
		margin-bottom: 20px;
	}
	.name-email {
		font-size: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	input {
		width: calc(100% - 40px);
		margin-bottom: 20px;
	}
	label {
		margin-bottom: 10px;
	}
	.organization {
		opacity: 0.5;
	}
	@media (max-width: 750px) {
		div {
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
