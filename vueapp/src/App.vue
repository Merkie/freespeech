<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
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
        icon
        v-if="passcode"
        @click="toggleLocked"
      >
        <v-icon>{{ locked ? 'lock_open' : 'lock' }}</v-icon>
      </v-btn>

      <v-btn
        icon
        v-if="customTilePad"
        :disabled="passcode && locked"
        @click="this.toggleEditMode"
      >
        <v-icon>{{ editMode ? 'save' : 'edit ' }}</v-icon>
      </v-btn>

      <v-btn
        icon
        to="/about"
        :disabled="passcode && locked"
      >
        <v-icon>
          info
        </v-icon>
      </v-btn>

      <v-btn
        icon
        to="/settings"
        :disabled="passcode && locked"
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
      Incorrect passcode
    </v-snackbar>

    <v-dialog
      v-model="passcodeEntry"
      width="400"
      persistent
    >
      <NumberPad
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
  methods: {
    ...mapActions({
      setLocked: 'settings/setLocked',
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
        return { text: `${voice.name} (${voice.lang})`, value: index };
      }).sort((a, b) => a.text.localeCompare(b.text));

      this.setVoices(windowVoices);
      this.setVoiceOptions(voiceOptions);
    },
    toggleLocked(){
      if (this.locked) {
        this.passcodeEntry = true;
      } else {
        this.setLocked(true);
      }
    }
  },
  computed: {
    ...mapGetters({
      customTilePad: 'settings/customTilePad',
      editMode: 'tilePad/editMode',
      locked: 'settings/locked',
      passcode: 'settings/passcode',
    })
  },
  created(){
    let windowVoices = window.speechSynthesis.getVoices();

    if (!windowVoices.length > 0) {
      const vm = this;
      window.speechSynthesis.onvoiceschanged = () => vm.populateVoiceData(window.speechSynthesis.getVoices());
    } else {
      this.populateVoiceData(windowVoices);
    }
  }
};
</script>
