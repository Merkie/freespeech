<script lang="ts">
	import { onDestroy } from 'svelte';
	import ModalShell from './ModalShell.svelte';
	import Numpad from '$components/common/Numpad.svelte';
	import {
		LocalSettings,
		PinEntryModalOpen,
		PinPromptText,
		PinSetupModalOpen,
		PinUnlockHandler
	} from '$ts/client/stores';
	import {
		PIN_LENGTH,
		clearLockout,
		lockoutRemainingMs,
		makeMultiplicationChallenge,
		registerFailedAttempt,
		verifyPin
	} from '$ts/client/pin';

	type Mode = 'entry' | 'reset';

	let mode: Mode = 'entry';
	let pinValue = '';
	let answerValue = '';
	let error = '';
	let attemptsLeft = 0;
	let challenge = makeMultiplicationChallenge();

	// Reactive "now" so the lockout countdown ticks.
	let now = Date.now();
	let timer: ReturnType<typeof setInterval> | null = null;

	function startTimer() {
		if (timer) return;
		timer = setInterval(() => (now = Date.now()), 250);
	}
	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}
	onDestroy(stopTimer);

	$: remainingMs = Math.max(0, ($LocalSettings.editPinLockoutUntil || 0) - now);
	$: locked = remainingMs > 0;
	$: remainingLabel = formatRemaining(remainingMs);

	function formatRemaining(ms: number) {
		const total = Math.ceil(ms / 1000);
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	// Reset transient state whenever the modal opens.
	$: if ($PinEntryModalOpen) {
		startTimer();
	} else {
		stopTimer();
	}

	function resetState() {
		mode = 'entry';
		pinValue = '';
		answerValue = '';
		error = '';
		attemptsLeft = 0;
		challenge = makeMultiplicationChallenge();
	}

	function close() {
		$PinEntryModalOpen = false;
		resetState();
	}

	function recordFailure(message: string) {
		const result = registerFailedAttempt();
		attemptsLeft = result.attemptsLeft;
		if (result.lockedOut) {
			now = Date.now();
			error = '';
		} else {
			error = `${message} ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`;
		}
	}

	async function onPinComplete(e: CustomEvent<string>) {
		if (locked) return;
		const ok = await verifyPin(e.detail);
		if (ok) {
			clearLockout();
			const handler = $PinUnlockHandler;
			close();
			handler();
			return;
		}
		pinValue = '';
		recordFailure('Incorrect PIN.');
	}

	function goToReset() {
		mode = 'reset';
		answerValue = '';
		error = '';
		challenge = makeMultiplicationChallenge();
	}

	function checkAnswer() {
		if (locked || answerValue === '') return;
		if (parseInt(answerValue, 10) === challenge.answer) {
			clearLockout();
			// Correct math → allow setting a brand new PIN.
			$PinEntryModalOpen = false;
			resetState();
			$PinSetupModalOpen = true;
			return;
		}
		answerValue = '';
		challenge = makeMultiplicationChallenge();
		recordFailure('Wrong answer.');
	}
</script>

{#if $PinEntryModalOpen}
	<ModalShell closeModal={close} title={mode === 'entry' ? 'Enter PIN' : 'Reset PIN'}>
		<div class="flex flex-col items-center gap-6 py-2">
			{#if locked}
				<div class="flex flex-col items-center gap-3 py-6 text-center">
					<i class="bi bi-lock-fill text-4xl text-amber-400"></i>
					<p class="text-lg font-semibold text-zinc-100">Too many attempts</p>
					<p class="text-sm text-zinc-400">Try again in</p>
					<p class="font-mono text-3xl tabular-nums text-zinc-100">{remainingLabel}</p>
				</div>
			{:else if mode === 'entry'}
				<p class="text-center text-sm text-zinc-400">
					{$PinPromptText}
				</p>
				<Numpad bind:value={pinValue} maxLength={PIN_LENGTH} on:complete={onPinComplete} />
				{#if error}
					<p class="text-center text-sm text-red-400">{error}</p>
				{/if}
				<button
					type="button"
					on:click={goToReset}
					class="text-sm text-zinc-400 underline-offset-2 transition-all hover:text-zinc-200 hover:underline"
				>
					Forgot PIN?
				</button>
			{:else}
				<p class="text-center text-sm text-zinc-400">
					To reset your PIN, solve this problem:
				</p>
				<p class="text-4xl font-semibold text-zinc-100">
					{challenge.a} &times; {challenge.b} = ?
				</p>
				<Numpad bind:value={answerValue} maxLength={2} masked={false} />
				{#if error}
					<p class="text-center text-sm text-red-400">{error}</p>
				{/if}
				<div class="flex w-full items-center justify-center gap-3">
					<button
						type="button"
						on:click={() => {
							mode = 'entry';
							error = '';
							pinValue = '';
						}}
						class="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-all hover:bg-zinc-800"
					>
						Back
					</button>
					<button
						type="button"
						on:click={checkAnswer}
						disabled={answerValue === ''}
						class="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-40"
					>
						Submit
					</button>
				</div>
			{/if}
		</div>
	</ModalShell>
{/if}
