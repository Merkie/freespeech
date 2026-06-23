<script lang="ts">
	import ModalShell from './ModalShell.svelte';
	import Numpad from '$components/common/Numpad.svelte';
	import { PinSetupModalOpen } from '$ts/client/stores';
	import { PIN_LENGTH, setPin } from '$ts/client/pin';

	type Step = 'enter' | 'confirm';

	let step: Step = 'enter';
	let firstPin = '';
	let value = '';
	let error = '';
	let saving = false;

	function resetState() {
		step = 'enter';
		firstPin = '';
		value = '';
		error = '';
		saving = false;
	}

	function close() {
		$PinSetupModalOpen = false;
		resetState();
	}

	async function onComplete(e: CustomEvent<string>) {
		const entered = e.detail;
		if (step === 'enter') {
			firstPin = entered;
			value = '';
			error = '';
			step = 'confirm';
			return;
		}

		// confirm step
		if (entered !== firstPin) {
			error = "PINs didn't match. Start over.";
			firstPin = '';
			value = '';
			step = 'enter';
			return;
		}

		saving = true;
		await setPin(entered);
		saving = false;
		close();
	}
</script>

{#if $PinSetupModalOpen}
	<ModalShell closeModal={close} title={step === 'enter' ? 'Set a PIN' : 'Confirm PIN'}>
		<div class="flex flex-col items-center gap-6 py-2">
			<p class="text-center text-sm text-zinc-400">
				{step === 'enter'
					? `Choose a ${PIN_LENGTH}-digit PIN to protect edit mode.`
					: 'Re-enter your PIN to confirm.'}
			</p>
			{#key step}
				<Numpad bind:value maxLength={PIN_LENGTH} on:complete={onComplete} disabled={saving} />
			{/key}
			{#if error}
				<p class="text-center text-sm text-red-400">{error}</p>
			{/if}
		</div>
	</ModalShell>
{/if}
