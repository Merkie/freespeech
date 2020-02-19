<template>
  <div>
    <v-row>
      <v-spacer />
      <v-btn
        class="my-3"
        @click="toggleSentenceMode"
      >
        {{ sentenceMode ? "Disable" : "Enable" }} Sentence Mode
      </v-btn>
      <v-spacer />
    </v-row>

    <Sentence
      v-if="sentenceMode"
      :tile-pad-to-display="sentenceTiles"
      @clearSentence="sentenceTiles = []"
      @speakSentence="speakSentence"
      @removeFromSentence="sentenceTiles.splice($event, 1)"
    />
    <v-container
      fluid
      class="grey lighten-5 pb-10"
      style="{text-align: center}"
    >
      <v-row
        dense
        v-for="(row, index) in tilePadToDisplay"
        :key="index"
        class="tilePadContainer"
      >
        <template v-for="(tile, tileIndex) in row">
          <v-col
            :key="tileIndex"
            :cols="
              $vuetify.breakpoint.xsOnly
                ? 3
                : $vuetify.breakpoint.smAndDown
                  ? 2
                  : 1
            "
            class="d-flex child-flex"
          >
            <Tile
              @speakText="speakText"
              @addToSentence="sentenceTiles.push($event)"
              :tile-data="tile"
              :tile-page="currentTilePadPage"
            />
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

// object to access the speechSynthesis API
const SPEECH_SYNTHESIS = window.speechSynthesis;
const VOICES = SPEECH_SYNTHESIS.getVoices();

import TileData from '../../../build.json';
import Tile from '@/components/TilePad/Tile';
import Sentence from '@/components/Sentence/Sentence';

export default {
  name: 'TilePad',
  components: {
    Tile,
    Sentence
  },
  data() {
    return {
      tileData: TileData,
      voices: VOICES,
      sentenceTiles: []
    };
  },
  computed: {
    ...mapState('tilePad', ['sentenceMode']),
    ...mapGetters({
      selectedVoiceIndex: 'settings/selectedVoiceIndex',
      customTilePadOption: 'settings/customTilePad',
      customTilePadData: 'tilePad/customTilePadData'
    }),
    tilePadToDisplay: function() {
      //Checks to see if custom tile from store is empty, and if so sets the tile pad to the static one so they have something to start with, feel like there is a better way to prime the data.
      if (
        Object.entries(this.customTilePadData).length === 0 &&
        this.customTilePadData.constructor === Object
      ) {
        this.setCustomTilePadData(this.tileData);
      }

      let tilePadTiles = this.customTilePadOption
        ? this.customTilePadData
        : this.tileData;

      let routeParam = this.$route.params.layout;
      if (typeof routeParam === 'undefined') {
        return tilePadTiles.home;
      } else {
        return tilePadTiles[routeParam];
      }
    },
    currentTilePadPage() {
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
      setCustomTilePadData: 'tilePad/setCustomTilePadData',
      toggleSentenceMode: 'tilePad/toggleSentenceMode'
    }),
    speakText(textToSpeak) {
      let speechSynthesisUtterance = new SpeechSynthesisUtterance(textToSpeak);

      speechSynthesisUtterance.voice = this.voices[this.selectedVoiceIndex];
      SPEECH_SYNTHESIS.speak(speechSynthesisUtterance);
    },
    /**
     * Speaks the sentence that is currently in the sentenceTiles variable
     */
    speakSentence() {
      let textToSpeak = this.sentenceTiles.map(tile => tile.text).join(' ');
      this.speakText(textToSpeak);
    }
  }
};
</script>
