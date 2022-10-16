<script lang="ts">
	import { blobToBase64 } from '$lib/client/blob2base64';
	import { Me } from '$lib/client/stores';
	import trpc from '$lib/client/trpc';

	// bindings
	let file_input: HTMLInputElement;
	let name = ($Me.name || '') + '';
	let is_edited = false;

	const logout = () => {
		document.cookie = 'freespeech-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		window.location.href = '/';
	};

	const handle_file_input = async () => {
		//@ts-ignore
		const file = file_input.files[0];
		var reader = new FileReader(); // Make reader
		reader.readAsArrayBuffer(file); // Read file as array buffer

		// wait for reader to be done
		await new Promise<void>((resolve) => {
			reader.onload = () => {
				resolve();
			};
		});

		const blob = new Blob([reader.result || '']); // Convert to blob
		const base64 = await blobToBase64(blob); // Convert to base64

		const url = await trpc(fetch).mutation('s3:upload', {
			file: JSON.stringify({ blob: base64 }),
			filename: file.name
		});
		if (!url) return;

		$Me.image = url;
		await trpc(fetch).mutation('user:edit', {
			image: url
		});
	};

	const handle_user_edit = async () => {
		$Me.name = name;
		await trpc(fetch).mutation('user:edit', {
			name
		});
		is_edited = true;
	};

	$: {
		if (name !== ($Me.name || '')) is_edited = true;
	}
</script>

<h1>Account</h1>
<div>
	<span style="position: relative;">
		<img src={$Me.image || '/images/profile.png'} alt="profile" class="profile" />
		<span on:keypress={() => null} on:click={() => file_input.click()} class="add-image">
			<i class="bx bxs-image-add" />
		</span>
		<input type="file" style="display: none;" on:input={handle_file_input} bind:this={file_input} />
	</span>
	<span class="name-email">
		<h3>{$Me.name}</h3>
		<p>{$Me.email}</p>
		{#if $Me.organization}
			<p class="organization"><i class="bx bx-buildings" /> {$Me.organization.name}</p>
		{/if}
	</span>
</div>

<label for="">Name:</label>
<input type="text" placeholder="Linus Torvalds" bind:value={name} />

<span class="btn-group" style="display: flex; gap: 10px; margin-bottom: 10px;">
	<button disabled={!is_edited} on:click={handle_user_edit}>Save changes</button>
	<button disabled={true}>Change my password</button>
</span>
<button class="logout" on:click={logout}>Logout</button>

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
		width: calc(100% - 33px);
		margin-bottom: 20px;
	}
	label {
		margin-bottom: 10px;
	}
	.organization {
		opacity: 0.5;
	}
	.add-image {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: var(--base-300);
		border-radius: 50%;
		padding: 7px 10px;
		border: 5px solid var(--base-100);
		cursor: pointer;
		font-size: 20px;
	}
	.add-image:hover {
		background-color: var(--base-400);
	}

	.logout {
		background-color: var(--danger-300);
		border-color: var(--danger-400);
	}
	@media (max-width: 750px) {
		div {
			flex-direction: column;
			gap: 10px;
			width: calc(100% - 40px);
			text-align: center;
			background: none;
			border: none;
			padding: 0;
			padding-left: 20px;
		}

		.btn-group button {
			flex: 1;
		}

		.logout {
			width: 100%;
			margin-top: 20px;
		}
	}
</style>
