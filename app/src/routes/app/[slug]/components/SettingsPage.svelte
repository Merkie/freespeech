<script lang="ts">
	// Fuse (fuzzy search)
	import Fuse from 'fuse.js';

	// Components
	import Header from '$lib/client/components/Header.svelte';

	// Bindings
	let search_text: string;
	let voices = speechSynthesis.getVoices().map((voice) => `${voice.name} ${voice.lang}`);

	// In case new voices are added asynchronously
	window.speechSynthesis.onvoiceschanged = function (e) {
		voices = speechSynthesis.getVoices().map((voice) => `${voice.name} ${voice.lang}`);
	};

	let settings = [
		{
			name: 'Default page dimensions (rows x columns):',
			type: 'text',
			default: '8x6',
			value: '8x6',
			placeholder: '8x6',
			onInput: (value: string) => {
				console.log(value);
			},
			reset_to_default: () => {
				console.log('resetting to default');
			}
		},
		{
			name: 'SpeechSynthesis voice:',
			type: 'select',
			default: voices[0],
			options: voices,
			value: voices[0],
			onInput: (value: string) => {},
			reset_to_default: () => {}
		},
		{
			name: 'Guided Access Passcode:',
			type: 'text',
			default: '',
			value: '',
			placeholder: '1234',
			onInput: (value: string) => {
				console.log(value);
			},
			reset_to_default: () => {
				console.log('resetting to default');
			}
		}
	];

	const fuse = new Fuse(settings, { includeScore: true, keys: ['name'] });
</script>

<Header uri="dashboard" button_text="Dashboard" />
<main>
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

			<button disabled={setting.item.value === setting.item.default}>Reset to default</button>
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
