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
        v-if="customTilePad && !editMode"
        @click="this.toggleEditMode"
      >
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn
        icon
        v-if="customTilePad && editMode"
        @click="this.toggleEditMode"
      >
        <v-icon>save</v-icon>
      </v-btn>
      <v-btn
        icon
        to="/about"
      >
        <v-icon>
          info
        </v-icon>
      </v-btn>

      <v-btn
        icon
        @click="toggleSettingsDialogVisibility"
      >
        <v-icon>
          settings
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
      <Settings />
      <editDialog />
    </v-content>
  </v-app>
</template>

<script>
import Settings from '@/views/Settings';
import EditDialog from '@/components/TilePad/EditTileDialog';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Settings,
    EditDialog
  },
  data: () => ({
    //
  }),
    methods: {
    ...mapActions({        
      toggleSettingsDialogVisibility: 'settings/toggleSettingsDialogVisibility',
      toggleEditMode: 'tilePad/toggleEditMode'
    }),
    populateVoiceData (windowVoices){
      const voiceOptions = windowVoices.map((voice, index) => {
        return { text: `${voice.name} (${voice.lang})`, value: index };
      }).sort((a, b) => a.text.localeCompare(b.text));

      this.$store.dispatch('settings/setVoices', windowVoices);
      this.$store.dispatch('settings/setVoiceOptions', voiceOptions);
    },
  },
  computed: {
    ...mapGetters({ 
      customTilePad: 'settings/customTilePad',
      editMode: 'tilePad/editMode'
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
