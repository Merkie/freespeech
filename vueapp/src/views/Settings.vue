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

		<v-switch
			v-model="tapCount"
			:label="$t('settings.displayTapCounter')"
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

		<div>
			<v-btn
				color="warning"
				class="mt-4 mr-4"
				@click="fullReset"
			>
				<v-icon class="mr-2">
					refresh
				</v-icon>
				{{ $t('settings.buttonReset') }}
			</v-btn>
		</div>

		<div>
			<v-btn
				color="white"
				class="mt-4 mr-4"
				@click="exportSettings"
			>
				<v-icon class="mr-2">
					cloud_download
				</v-icon>
				{{ $t('settings.buttonExport') }}
			</v-btn>

			<v-btn
				color="white"
				class="mt-4 mr-4"
				@click="$refs.importSettingsFile.click()"
			>
				<v-icon class="mr-2">
					cloud_upload
				</v-icon>
				{{ $t('settings.buttonImport') }}
			</v-btn>

			<input
				ref="importSettingsFile"
				type="file"
				style="display: none"
				@change="importSettings"
			>
		</div>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { saveAs } from 'file-saver';
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
			customTilePad: 'settings/customTilePad',
			customTilePadData: 'tilePad/customTilePadData',
			locale: 'settings/locale',
			passcode: 'settings/passcode',
			voiceOptions: 'settings/voiceOptions',
			voices: 'settings/voices',
			displayTapCount: 'settings/displayTapCount',
		}),
		selectedVoiceIndex: {
			get() {
				let voiceIndex = this.$store.state.settings.selectedVoiceIndex;
				return this.voiceOptions.filter(x => x.value === voiceIndex)[0];
			},
			set(value) {
				this.setSelectedVoiceIndex(value);
				const speechSynthesisUtterance = new SpeechSynthesisUtterance('Welcome to Free Speech');
				speechSynthesisUtterance.voice = this.voices[value];
				window.speechSynthesis.speak(speechSynthesisUtterance);
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
		},
		tapCount: {
			get(){
				return this.displayTapCount;
			},
			set(value){
				this.setDisplayTapCount(value);
			}
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
			toggleSentenceMode: 'settings/toggleSentenceMode',
			setDisplayTapCount: 'settings/setDisplayTapCount',
		}),
		exportSettings() {
			const json = JSON.stringify({
				'settings/setSentenceMode': this.sentenceMode,
				'settings/setCustomTilePad': this.customTilePad,
				'settings/setPasscode': this.passcode,
				'tilePad/setCustomTilePadData': this.customTilePadData
			});

			const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
			saveAs(blob, 'freespeech-settings.json');
		},
		async importSettings() {
			if (typeof this.$refs.importSettingsFile.files === 'undefined') {
				return;
			}

			const json = await this.$refs.importSettingsFile.files[0].text();
			const data = JSON.parse(json);
			if (data) {
				for (const [key, value] of Object.entries(data)) {
					await this.$store.dispatch(key, value);
				}
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
		},
		handlePasscodeInput(input) {
			this.passcodeEntry = false;

			if (input !== null && input.length === this.passcodeLength) {
				this.setPasscode(input);
				this.setLocked(true);
			} else {
				this.setPasscode(null);
			}
		}
	}
};
</script>
