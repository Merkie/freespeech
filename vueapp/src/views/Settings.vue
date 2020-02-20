<template>
	<v-container class="pb-10">
		<h1 class="mb-5">
			{{ $t('settings.title') }}
		</h1>

		<v-select
			v-model="selectedLanguage"
			:items="languageOptions"
			:label="$t('settings.optionLanguage')"
		/>

		<v-select
			v-model="selectedVoiceIndex"
			:items="voiceOptions"
			:label="$t('settings.optionVoice')"
		/>

		<v-switch
			v-model="customTilePad"
			:label="$t('settings.optionCustomTilePad')"
		/>

		<v-switch
			v-model="sentenceMode"
			:label="$t('settings.optionCreateSentences')"
		/>

		<v-switch
			v-model="passcodeEnabled"
			:label="$t('settings.optionPasscodeEnabled')"
		/>

		<v-dialog
			v-model="passcodeEntry"
			width="400"
			persistent
		>
			<NumberPad
				:title="$t('settings.titleSetPasscode')"
				:length="passcodeLength"
				:hidden="true"
				@input="handlePasscodeInput"
			/>
		</v-dialog>

		<v-dialog
			v-model="passcodeEntry"
			width="400"
			persistent
		>
			<NumberPad
				:title="$t('settings.titleSetPasscode')"
				:length="passcodeLength"
				:hidden="true"
				@input="handlePasscodeInput"
			/>
		</v-dialog>

		<v-btn
			color="warning"
			class="mt-4"
			@click="fullReset"
		>
			<v-icon class="mr-2">
				refresh
			</v-icon>
			Reset all Settings &amp; Custom Tiles
		</v-btn>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NumberPad from '@/components/NumberPad/NumberPad.vue';

export default {
	name: 'Settings',
	components: { NumberPad },
	data() {
		return {
			passcodeEntry: false,
			passcodeLength: 4,
		};
	},
	computed: {
		...mapGetters({
			locale: 'settings/locale',
			passcode: 'settings/passcode',
			voiceOptions: 'settings/voiceOptions',
		}),
		selectedVoiceIndex: {
			get() {
				let voiceIndex = this.$store.state.settings.selectedVoiceIndex;
				return this.voiceOptions.filter(x => x.value === voiceIndex)[0];
			},
			set(value) {
				this.setSelectedVoiceIndex(value);
			}
		},
		customTilePad: {
			get(){
				return this.$store.state.settings.customTilePad;
			},
			set(value){
				if(!value){
					this.setEditMode(false);
				}
				this.toggleCustomTilePad();
			}
		},
		passcodeEnabled: {
			get(){
				return this.passcode !== null;
			},
			set(value){
				if (value === true) {
					this.setPasscode('');
					this.passcodeEntry = true;
				} else {
					this.setPasscode(null);
				}
			}
		},
		sentenceMode: {
			get(){
				return this.$store.state.settings.sentenceMode;
			},
			set(){
				this.toggleSentenceMode();
			}
		},
		selectedLanguage: {
			get() {
				return this.locale;
			},
			set(value) {
				this.$root.$i18n.locale = value;
				this.setLocale(value);
			}
		},
		languageOptions() {
			return Object.entries(this.$i18n.messages).map(entry => {
				return { value: entry[0],
					text: entry[1].languageName };
			});
		}
	},
	methods: {
		...mapActions({
			setEditMode: 'tilePad/setEditMode',
			setLocale: 'settings/setLocale',
			setLocked: 'settings/setLocked',
			setPasscode: 'settings/setPasscode',
			setSelectedVoiceIndex: 'settings/setSelectedVoiceIndex',
			toggleCustomTilePad: 'settings/toggleCustomTilePad',
			toggleSentenceMode: 'settings/toggleSentenceMode'
		}),
		handlePasscodeInput(input) {
			this.passcodeEntry = false;

			if (input !== null && input.length === this.passcodeLength) {
				this.setPasscode(input);
				this.setLocked(true);
			} else {
				this.setPasscode(null);
			}
		},
		fullReset() {
			if (!confirm('Are you sure you want to reset all settings and custom tiles?')) {
				return false;
			}

			if (typeof window.localStorage !== 'undefined') {
				window.localStorage.removeItem('vuex');
			}

			document.location.reload();
		}
	}
};
</script>
