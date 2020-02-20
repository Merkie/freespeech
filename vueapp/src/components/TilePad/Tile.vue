<template>
  <v-card
    raised
    tile
    class="mx-auto"
    @click="tileClickedEvent"
    :color="typeof localeTileData.accent === 'undefined' ? '' : cardColor"
  >
    <v-container
      justify="
    center"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-img
          max-height="32"
          max-width="32"
          aspect-ratio="1"
          :src="localeTileData.image"
        />
      </v-row>
      <v-row>
        <v-card-text
          class="text-center"
          justify="center"
        >
          <h3>{{ localeTileData.name }}</h3>
        </v-card-text>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'Tile',
  props: {
    tileData: {
      type: Object,
      default() {
        return {
          name: '',
          text: '',
          accent: '',
          image: '',
          id: 0,
          messages: {}
        };
      }
    },
    tilePage: {
      type: String,
      default: ''
    },
    inSentenceComponent: {
      type: Boolean,
      default: false
    },
    sentenceIndex: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapState('settings', ['sentenceMode']),
    ...mapGetters({
      editMode: 'tilePad/editMode',
      locale: 'settings/locale'
    }),
    cardColor: function() {
      let cardHexColor;

      switch (this.localeTileData.tileData.accent) {
        case 'red':
          cardHexColor = '#FF9AA2';
          break;
        case 'blush':
          cardHexColor = '#FFB7B2';
          break;
        case 'peach':
          cardHexColor = '#FFB7B2';
          break;
        case 'pear':
          cardHexColor = '#E2F0CB';
          break;
        case 'mint':
          cardHexColor = '#B5EAD7';
          break;
        case 'violet':
          cardHexColor = '#C7CEEA';
          break;
        default:
          cardHexColor = this.localeTileData.accent;
          break;
      }
      return cardHexColor;
    },
    localeTileData() {
      const messages = this.tileData.messages;
      if (typeof messages !== 'undefined' && typeof messages[this.locale] === 'object') {
        return { ...this.tileData, ...messages[this.locale] };
      } else {
        return this.tileData;
      }
    }
  },
  methods: {
    ...mapActions({
      toggleEditDialogVisibility: 'tilePad/toggleEditDialogVisibility',
      setCurrentTileBeingEdited: 'tilePad/setCurrentTileBeingEdited'
    }),
    tileClickedEvent() {
      if (this.editMode) {
        // if in edit tiles mode
        let tileDataToEdit = this.tileData;
        tileDataToEdit.page = this.tilePage;
        this.setCurrentTileBeingEdited(tileDataToEdit);
        this.toggleEditDialogVisibility();
      } else if (this.sentenceMode) {
        // if in sentence mode
        if (this.inSentenceComponent) {
          // if its in the sentence component, remove it from the sentence
          this.$emit('removeFromSentence', this.sentenceIndex);
        } else {
          // if its not in the sentence component, speak it and add it to the sentence
          this.$emit('speakText', this.localeTileData.text);
          this.$emit('addToSentence', this.localeTileData);
        }
      } else if (
        typeof this.tileData.navigation === 'undefined' ||
        this.tileData.navigation === ''
      ) {
        this.$emit('speakText', this.localeTileData.text);
      } else {
        this.$router.push({
          name: 'tilePadWithRoute',
          params: { layout: this.tileData.navigation }
        });
      }
    }
  }
};
</script>

<style></style>
