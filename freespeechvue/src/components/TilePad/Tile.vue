<template>
  <v-card
    raised
    tile
    class="mx-auto"
    @click="$emit('speakText', tileData.text)"
    :color="typeof tileData.accent === 'undefined' ? '' : cardColor"
  >
    <v-container
      justify="
    center"
    >
      <v-row align="center" justify="center">
        <v-img
          max-height="32"
          max-width="32"
          aspect-ratio="1"
          :src="tileData.image"
        />
      </v-row>
      <v-row>
        <v-card-text class="" align="center" justify="center">
          <h3> {{ tileData.name }} </h3>
        </v-card-text>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

export default {
  name: "ImageTile",
  props: {
    tileData: {
      type: Object,
      default: Object
    }
  }, computed: {
        cardColor: function(){
            let cardHexColor;

            switch(this.tileData.accent) {
                case "red":
                    cardHexColor = "#FF9AA2";
                    break;
                case "blush":
                    cardHexColor = "#FFB7B2";
                    break;
                case "peach":
                    cardHexColor = "#FFB7B2";
                    break;
                case "pear":
                    cardHexColor = "#E2F0CB";
                    break;
                case "mint":
                    cardHexColor = "#B5EAD7";
                    break;
                case "violet":
                    cardHexColor = "#C7CEEA";
                    break;
                default:
                    cardHexColor = ""
                    break;
            }
            return cardHexColor;
        }
  },
};
</script>

<style>

</style>
