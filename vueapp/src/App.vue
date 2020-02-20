<template>
	<v-app>
		<v-app-bar
			app
			:color="taskbarColor"
			dark
		>
			<div class="d-flex align-center">
				<h2>Freespeech</h2>
			</div>

			<v-spacer />

			<v-btn
				icon
				to="/"
			>
				<v-icon>
					home
				</v-icon>
			</v-btn>

			<v-btn
				v-if="passcode"
				icon
				@click="toggleLocked"
			>
				<v-icon>{{ locked ? 'lock_open' : 'lock' }}</v-icon>
			</v-btn>

			<v-btn
				v-if="customTilePad"
				icon
				:disabled="isLocked"
				@click="toggleEditMode"
			>
				<v-icon>{{ editMode ? 'save' : 'edit ' }}</v-icon>
			</v-btn>

			<v-btn
				icon
				to="/about"
				:disabled="isLocked"
				@click="disableEditMode"
			>
				<v-icon>
					info
				</v-icon>
			</v-btn>

			<v-btn
				icon
				to="/settings"
				:disabled="isLocked"
				@click="disableEditMode"
			>
				<v-icon>
					settings
				</v-icon>
			</v-btn>
		</v-app-bar>

		<v-content>
			<router-view />
			<editDialog />
		</v-content>

		<v-snackbar
			v-model="passcodeError"
			color="error"
			top
		>
			{{ $t('app.errorIncorrectPasscode') }}
		</v-snackbar>

		<v-dialog
			v-model="passcodeEntry"
			width="400"
			persistent
		>
			<NumberPad
				:title="$t('app.titleEnterPasscode')"
				:length="passcodeLength"
				:hidden="true"
				@input="handlePasscodeInput"
			/>
		</v-dialog>
	</v-app>
</template>

<script>
import EditDialog from '@/components/TilePad/EditTileDialog';
import NumberPad from '@/components/NumberPad/NumberPad';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'App',
	components: {
		EditDialog,
		NumberPad
	},
	data: () => ({
		passcodeEntry: false,
		passcodeError: false,
		passcodeLength: 4,
	}),
	computed: {
		...mapGetters({
			customTilePad: 'settings/customTilePad',
			editMode: 'tilePad/editMode',
			locale: 'settings/locale',
			locked: 'settings/locked',
			passcode: 'settings/passcode',
			selectedVoiceIndex: 'settings/selectedVoiceIndex'
		}),
		isLocked() {
			return this.passcode !== null && this.passcode.length > 0 && this.locked;
		},
		taskbarColor() {
			return this.editMode ? 'success' : 'primary';
		}
	},
	created() {
		if (this.locale === null) {
			const defaultLanguage = navigator.languages
				? navigator.languages[0]
				: (navigator.language || navigator.userLanguage);
			this.setLocale(defaultLanguage.substr(0, 2));
		}

		this.$root.$i18n.locale = this.locale;

		let windowVoices = window.speechSynthesis.getVoices();

		if (!windowVoices.length > 0) {
			const vm = this;
			window.speechSynthesis.onvoiceschanged = () => vm.populateVoiceData(window.speechSynthesis.getVoices());
		} else {
			this.populateVoiceData(windowVoices);
		}
	},
	methods: {
		...mapActions({
			setLocale: 'settings/setLocale',
			setLocked: 'settings/setLocked',
			setSelectedVoiceIndex: 'settings/setSelectedVoiceIndex',
			setVoices: 'settings/setVoices',
			setVoiceOptions: 'settings/setVoiceOptions',
			toggleEditMode: 'tilePad/toggleEditMode'
		}),
		handlePasscodeInput (input) {
			this.passcodeEntry = false;

			if (input === this.passcode) {
				this.setLocked(false);
			} else if (input !== null) {
				this.passcodeError = true;
			}
		},
		populateVoiceData (windowVoices){
			const voiceOptions = windowVoices.map((voice, index) => {
				if (this.selectedVoiceIndex === null && voice.lang.substring(0, 2) === this.locale) {
					this.setSelectedVoiceIndex(index);
				}
				return {
					text: `${voice.name} (${voice.lang})`,
					value: index
				};
			}).sort((a, b) => a.text.localeCompare(b.text));

			this.setVoices(windowVoices);
			this.setVoiceOptions(voiceOptions);
		},
		disableEditMode() {
			this.$store.dispatch('tilePad/setEditMode', false);
		},
		toggleLocked(){
			if (this.locked) {
				this.passcodeEntry = true;
			} else {
				this.disableEditMode();
				this.setLocked(true);
			}
		}
	}
};
</script>
