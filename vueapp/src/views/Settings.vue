<template>
  <v-dialog
    v-model="settingsDialogVisibility"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
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
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="toggleSettingsDialogVisibility"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Settings',
  data() {
    return {
      dialog: true,
    };
  },
  computed: {
    ...mapGetters({
      settingsDialogVisibility: 'settings/settingsDialogVisibility',
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
      setSelectedVoiceIndex: 'settings/setSelectedVoiceIndex',
      toggleSettingsDialogVisibility: 'settings/toggleSettingsDialogVisibility',
      toggleCustomTilePad: 'settings/toggleCustomTilePad',
      setEditMode:'tilePad/setEditMode',
      toggleSentenceMode: 'settings/toggleSentenceMode'
    }),
  },
};
</script>
