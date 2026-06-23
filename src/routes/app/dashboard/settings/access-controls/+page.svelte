<script lang="ts">
	import { LocalSettings, PinSetupModalOpen } from '$ts/client/stores';
	import { disablePin } from '$ts/client/pin';
	import PinSetupModal from '$components/modals/PinSetupModal.svelte';

	function togglePin() {
		if ($LocalSettings.editPinEnabled) {
			disablePin();
		} else {
			// Enabling requires actually choosing a PIN; the gate flips on once set.
			$PinSetupModalOpen = true;
		}
	}
</script>

<div class="flex flex-col gap-12 p-8 pb-[200px]">
	<div class="flex flex-col gap-8">
		<a
			href="/app/dashboard/settings"
			class="w-fit p-2 pl-0 text-xl text-zinc-600 hover:text-zinc-800"
		>
			<i class="bi bi-arrow-left-short"></i>
			<span>Back</span>
		</a>

		<p class="border-b border-zinc-300 pb-8 text-4xl text-zinc-600">Access Controls</p>
	</div>

	<div class="flex flex-col gap-8">
		<div class="flex items-center gap-4">
			<div class="flex flex-col">
				<p class="text-3xl text-zinc-800">Require a PIN to edit</p>
				<p class="text-lg text-zinc-500">
					When on, you must enter your PIN to enter edit mode on this device.
				</p>
			</div>
			<div class="flex-1"></div>
			<button
				on:click={togglePin}
				class={`relative w-[48px] shrink-0 scale-[120%] rounded-full p-1 shadow-sm transition-all ${$LocalSettings.editPinEnabled ? 'bg-green-500' : 'bg-zinc-300'}`}
			>
				<div
					style={`transform: translateX(${!$LocalSettings.editPinEnabled ? '0' : '100%'});`}
					class="h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all"
				></div>
			</button>
		</div>

		{#if $LocalSettings.editPinEnabled}
			<div class="flex items-center gap-4">
				<p class="text-2xl text-zinc-700">PIN</p>
				<div class="flex-1"></div>
				<button
					on:click={() => ($PinSetupModalOpen = true)}
					class="rounded-lg border-2 border-zinc-300 px-5 py-2 text-xl text-zinc-700 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
				>
					Change PIN
				</button>
			</div>

			<div class="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 text-zinc-600">
				<p class="text-lg">
					<i class="bi bi-info-circle-fill text-amber-500"></i>
					Forgot your PIN? On the PIN screen, tap <span class="font-semibold">Forgot PIN?</span> and
					answer a multiplication question to set a new one. After 3 wrong attempts you'll need to
					wait 5 minutes before trying again.
				</p>
				<p class="mt-2 text-sm text-zinc-500">
					This is a device-only control to prevent accidental edits — it isn't account security.
				</p>
			</div>
		{/if}
	</div>
</div>

<PinSetupModal />
