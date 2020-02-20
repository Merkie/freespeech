<template>
  <v-container class="pb-10">
    <h1 class="mb-5">
      Settings
    </h1>

    <v-select
      :items="voiceOptions"
      label="Voice"
      v-model="selectedVoiceIndex"
    />

    <v-switch
      :label="customTilePad ? 'Custom Tile Pad' : 'Static Tile Pad'"
      v-model="customTilePad"
    />

    <v-switch
      label="Create Sentences"
      v-model="sentenceMode"
    />

    <v-switch
      label="Passcode Enabled"
      v-model="passcodeEnabled"
    />

    <v-dialog
      v-model="passcodeEntry"
      width="400"
      persistent
    >
      <NumberPad
        title="Set Passcode"
        :length="passcodeLength"
        :hidden="true"
        @input="handlePasscodeInput"
      />
    </v-dialog>
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
		}
	},
	methods: {
		...mapActions({
			setEditMode: 'tilePad/setEditMode',
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
		}
	},
};
</script>
