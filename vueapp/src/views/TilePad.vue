<template>
  <div>
    <v-container
      v-if="editMode"
      fluid
      class="grey lighten-5 pb-10"
      style="{text-align: center}"
    >
      <v-card class="mx-10">
        <div class="px-8 py-5">
          <p class="title">You're in edit mode. Please save the changes before continuing to use Freespeech.</p>
          <v-btn
            @click="this.toggleEditMode"
          >
            <span>Save Changes</span>
            <v-icon>save</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-container>
    <Sentence
      v-if="sentenceMode && !editMode"
      :tile-pad-to-display="sentenceTiles"
      @clearSentence="sentenceTiles = []"
      @speakSentence="speakSentence"
      @removeFromSentence="sentenceTiles.splice($event, 1)"
    />
    <edit-mode-header
      v-if="sentenceMode && editMode"
    />
    <v-container
      fluid
      class="grey lighten-5 pb-10"
      style="{text-align: center}"
    >
      <v-row dense>
        <draggable
          style="display: contents"
          v-model="tilePadToDisplay.tileData"
          :options="{disabled: !editMode}"
          class="tilePadContainer"
        >
          <template v-for="(tile, tileIndex) in tilePadToDisplay.tileData">
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
              style="padding: 4px"
            >
              <Tile
                :class="editMode ? 'pulse' : ''"
                @speakText="speakText"
                @addToSentence="sentenceTiles.push($event)"
                :tile-data="tile"
                :tile-page="currentTilePadPage"
              />
            </v-col>
          </template>
        </draggable>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';

// object to access the speechSynthesis API
const SPEECH_SYNTHESIS = window.speechSynthesis;

import TileData from '../../../build.json';
import Tile from '@/components/TilePad/Tile';
import Sentence from '@/components/Sentence/Sentence';
import EditModeHeader from '@/components/EditModeHeader/EditModeHeader';

export default {
  name: 'TilePad',
  components: {
    Tile,
    Sentence,
    draggable,
    EditModeHeader
  },
  data() {
    return {
      tileData: TileData,
      sentenceTiles: [],
    };
  },
  computed: {
    ...mapState('settings', ['sentenceMode']),
    ...mapState('tilePad', ['editMode']),
    ...mapGetters({
      selectedVoiceIndex: 'settings/selectedVoiceIndex',
      customTilePadOption: 'settings/customTilePad',
      customTilePadData: 'tilePad/customTilePadData',
      voices: 'settings/voices',
      editMode: 'tilePad/editMode'
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
      toggleSentenceMode: 'tilePad/toggleSentenceMode',
      toggleEditMode: 'tilePad/toggleEditMode'
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
