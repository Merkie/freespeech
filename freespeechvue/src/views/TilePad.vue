<template>
  <v-container
    fluid
    class="grey lighten-5"
  >
    <v-row
      dense
      v-for="(row, index) in TileData"
      :key="index"
    > 
      <template v-for="(tile, tileIndex) in row">
        <v-col
          :key="tileIndex"
          :cols="isMobile ? 3 : 1"
          class="d-flex child-flex"
        >
          <Tile
            @speakText="speakText"
            :tile-data="tile"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

// object to access the speechSynthesis API
const SPEECH_SYNTHESIS = window.speechSynthesis;
const VOICES = SPEECH_SYNTHESIS.getVoices();

import TileData from '../../../build.json';
import Tile from '@/components/TilePad/Tile';
import { isMobile } from 'mobile-device-detect';

export default {
    name: 'TilePad',
    components: {
        Tile
    },
    data() {
        return {
            TileData: TileData.page,
            isMobile,
            voices: VOICES
        };
    },
  computed: {
      ...mapGetters(['selectedVoiceIndex'])
  },
  methods: {
      speakText(textToSpeak){
          let speechSynthesisUtterance = new SpeechSynthesisUtterance(textToSpeak);           
          
          speechSynthesisUtterance.voice = this.voices[this.selectedVoiceIndex];
          SPEECH_SYNTHESIS.speak(speechSynthesisUtterance);

      }
  }
};
</script>

<style>
</style>