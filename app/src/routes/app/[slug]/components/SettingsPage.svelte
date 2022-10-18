<script lang="ts">
	// Fuse (fuzzy search)
	import Fuse from 'fuse.js';

	// Components
	import Header from '$lib/client/components/Header.svelte';

	import { AppProject, Me, SelectedVoice, GuidedAccessPin } from '$lib/client/stores';
	import trpc from '$lib/client/trpc';
	import { voices as polly_voices } from '$lib/client/polly';

	// Bindings
	let search_text: string;
	let voices = [
		...Object.keys(polly_voices),
		...speechSynthesis.getVoices().map((voice) => `[SpeechSynthesis] ${voice.name} ${voice.lang}`)
	];
	let project_name: string = $AppProject.name;
	let project_description: string = $AppProject.description + '';
	let project_visibility: string = $AppProject.public ? 'public' : 'private';
	let project_columns: number = $AppProject.columns;

	let delete_button_pressed = false;
	let changes_made = false;

	// In case new voices are added asynchronously
	window.speechSynthesis.onvoiceschanged = function (e) {
		voices = [
			...Object.keys(polly_voices),
			...speechSynthesis.getVoices().map((voice) => `[SpeechSynthesis] ${voice.name} ${voice.lang}`)
		];
	};

	let settings = [
		// {
		// 	name: 'Default page dimensions (rows x columns):',
		// 	type: 'text',
		// 	default: '8x6',
		// 	value: '8x6',
		// 	placeholder: '8x6',
		// 	onInput: (value: string) => {
		// 	},
		// 	reset_to_default: () => {
		// 	}
		// },
		{
			name: 'Text-to-speech voice:',
			type: 'select',
			default: '[AWS] Kimberly (en-US female) Neural',
			options: voices,
			value: $SelectedVoice,
			onInput: (value: string) => {
				$SelectedVoice = value;
			},
			reset_to_default: () => {
				$SelectedVoice = '[AWS] Kimberly (en-US female) Neural';
			}
		},
		{
			name: 'Guided Access Passcode:',
			type: 'text',
			default: '',
			value: $GuidedAccessPin,
			placeholder: '1234',
			onInput: (value: string) => {
				$GuidedAccessPin = value;
			},
			reset_to_default: () => {
				$GuidedAccessPin = '';
			}
		}
	];

	let fuse = new Fuse(settings, { includeScore: true, keys: ['name'] });

	const handle_delete_btn_press = async () => {
		if (!delete_button_pressed) {
			delete_button_pressed = true;
		} else {
			const deletedProject = await trpc(fetch).mutation('project:delete', $AppProject.id);
			window.location.assign('/dashboard/projects');
		}
	};

	const save_changes = async () => {
		// Update locally
		$AppProject.name = project_name;
		$AppProject.description = project_description;
		$AppProject.public = project_visibility === 'public';
		$AppProject.columns = project_columns;
		// Push updates to server
		await trpc(fetch).mutation('project:edit', {
			id: $AppProject.id,
			name: project_name,
			description: project_description,
			public: project_visibility === 'public',
			columns: project_columns
		});
		// Reset changes_made
		changes_made = false;
	};

	const download_project = () => {
		const data_obj = {...$AppProject};
		//@ts-ignore
		delete data_obj.user;
		const data = JSON.stringify(data_obj);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.download = `${$AppProject.name}.json`;
		a.href = url;
		a.click();
	}
</script>

<Header uri="dashboard" button_text="Dashboard" />
<main>
	{#if $AppProject.userId === $Me.id}
		<h1>Project Settings</h1>
		<span style="margin-top: 0;">
			<label for="project_name">Project name:</label>
			<input
				type="text"
				name="project_name"
				bind:value={project_name}
				on:input={() => (changes_made = true)}
				placeholder="My awesome project"
			/>
		</span>
		<span>
			<label for="project_description">Project description:</label>
			<input
				type="text"
				name="project_description"
				bind:value={project_description}
				on:input={() => (changes_made = true)}
				placeholder="My awesome project description"
			/>
		</span>
		<span>
			<label for="project_columns">Project columns:</label>
			<input
				type="number"
				name="project_columns"
				bind:value={project_columns}
				on:input={() => (changes_made = true)}
				placeholder="8"
			/>
		</span>
		<span>
			<label for="project_description">Project visibility:</label>
			<select on:input={() => (changes_made = true)} bind:value={project_visibility}>
				<option value="private">Private</option>
				<option value="public">Public</option>
			</select>
		</span>
		<span style="margin-bottom: 20px;">
			<button disabled={!changes_made} on:click={save_changes}>Save changes</button>
			<button
				class="danger"
				on:click={handle_delete_btn_press}
				style={`opacity: ${delete_button_pressed ? '1' : '0.5'}`}>Delete this project</button
			>
			<button on:click={download_project}><i class='bx bx-download'></i> Download project</button>
		</span>
	{/if}
	<h1>Application Settings</h1>
	<label for="search">Search Settings</label>
	<input bind:value={search_text} type="text" name="search" placeholder="..." />

	{#each fuse.search(search_text || ':') as setting}
		<span>
			<label for={setting.item.name}>{setting.item.name}</label>
			{#if setting.item.type !== 'select'}
				<input
					type={setting.item.type}
					name={setting.item.name}
					placeholder={setting.item.placeholder}
					value={setting.item.value}
					on:input={(e) => {
						//@ts-ignore
						if (e.target) setting.item.onInput(e.target.value);
					}}
				/>
			{:else}
				<select
					name={setting.item.name}
					value={setting.item.value}
					on:input={(e) => {
						//@ts-ignore
						setting.item.onInput(e.target.value);
					}}
				>
					{#each setting.item.options || [] as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			{/if}

			<button
				on:click={setting.item.reset_to_default}
				disabled={setting.item.value === setting.item.default}>Reset to default</button
			>
		</span>
	{/each}
</main>

<style>
	h1 {
		font-weight: 500;
		margin-bottom: 20px;
	}
	main {
		margin-top: 50px;
		padding: 20px;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-bottom: 100px;
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--base-200) transparent;
	}
	label {
		margin-bottom: 5px;
	}
	span {
		display: flex;
		flex-direction: row;
		gap: 20px;
		align-items: center;
		margin-top: 20px;
	}
	span label {
		margin-bottom: 0px;
		font-weight: bold;
	}
	span input,
	span select {
		flex: 1;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
	}

	button * {
		flex: 0;
	}

	.danger {
		background-color: var(--danger-300);
		color: var(--danger-text);
		border-color: var(--danger-400);
	}

	@media (max-width: 750px) {
		span {
			flex-direction: column;
			gap: 10px;
		}
		span * {
			width: 100%;
		}
		span input {
			width: calc(100% - 34px);
		}
	}
</style>
