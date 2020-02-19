<template>
  <v-container
    fluid
    class="grey lighten-5 py-10"
    style="{text-align: center}"
  >
    <v-row
      dense
      v-for="(row, index) in tilePadToDisplay"
      :key="index"
    >
      <template v-for="(tile, tileIndex) in row">
        <v-col
          :key="tileIndex"
          :cols="$vuetify.breakpoint.xsOnly ? 3 : $vuetify.breakpoint.smAndDown ? 2 : 1"
          class="d-flex child-flex"
        >
          <Tile
            @speakText="speakText"
            :tile-data="tile"
            :tile-page="currentTilePadPage"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// object to access the speechSynthesis API
const SPEECH_SYNTHESIS = window.speechSynthesis;
const VOICES = SPEECH_SYNTHESIS.getVoices();

import TileData from '../../../build.json';
import Tile from '@/components/TilePad/Tile';

export default {
  name: 'TilePad',
  components: {
    Tile
  },
  data() {
    return {
      tileData: TileData,
      voices: VOICES,
    };
  },
  computed: {
    ...mapGetters({
      selectedVoiceIndex: 'settings/selectedVoiceIndex',
      customTilePadOption: 'settings/customTilePad',
      customTilePadData: 'tilePad/customTilePadData'
    }),
    tilePadToDisplay: function() {
      
      //Checks to see if custom tile from store is empty, and if so sets the tile pad to the static one so they have something to start with, feel like there is a better way to prime the data.
      if(Object.entries(this.customTilePadData).length === 0 && this.customTilePadData.constructor === Object){
        this.setCustomTilePadData(this.tileData);
      }

      let tilePadTiles = this.customTilePadOption ? this.customTilePadData : this.tileData;
      
      let routeParam = this.$route.params.layout;
      if (typeof routeParam === 'undefined') {
        return tilePadTiles.home;
      } else {
        return tilePadTiles[routeParam];
      }
    },
    currentTilePadPage(){
      let routeParam = this.$route.params.layout;
      if (typeof routeParam === 'undefined') {
        return 'home';
      } else {
        return routeParam;
      }
    }
  },
  methods: {
    ...mapActions({
      setCustomTilePadData : 'tilePad/setCustomTilePadData'
    }),
    speakText(textToSpeak) {
      let speechSynthesisUtterance = new SpeechSynthesisUtterance(textToSpeak);

      speechSynthesisUtterance.voice = this.voices[this.selectedVoiceIndex];
      SPEECH_SYNTHESIS.speak(speechSynthesisUtterance);
    }
  }
};
</script>

<style></style>
