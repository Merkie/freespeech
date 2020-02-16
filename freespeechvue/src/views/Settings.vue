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
import {mapActions, mapGetters} from 'vuex';

const VOICES = window.speechSynthesis.getVoices();

let voiceOptions = (VOICES.map((voice, index) => {
    return {text: `${voice.name} (${voice.lang})`, value: index}
})).sort((a,b) => a.text.localeCompare(b.text));

export default {
    
    name:"Settings",
    data () {
        return {
        dialog: true,
        voiceOptions,
        voices: VOICES
        }      
    },
    computed: {
        ...mapGetters(['settingsDialogVisibility']),
        selectedVoiceIndex: {
            get(){
                let voiceIndex = this.$store.state.selectedVoiceIndex;
                return voiceOptions.filter(x => x.value === voiceIndex)[0];
            },
            set(value){            
                this.setselectedVoiceIndex(value);
            }
        }  
        },
        methods: {
            ...mapActions(['setselectedVoiceIndex','toggleSettingsDialogVisibility'])
        }
}
</script>
