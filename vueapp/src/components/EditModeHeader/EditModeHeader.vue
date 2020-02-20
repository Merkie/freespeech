<template>
  <div class="sentenceCardContainer grey lighten-5">
    <v-card
      outlined
      class="px-4 sentenceCard"
    >
      <v-card-title>
        You're in edit mode!
        <v-spacer />
        <v-btn
          class="mx-2"
          color="success"
          @click="exitEditMode"
        >
          <v-icon class="pr-2">
            save
          </v-icon> Save Changes
        </v-btn>
      </v-card-title>
      <v-container class="py-0">
        <p
          class="body-2"
        >
          You can edit tiles while in edit mode by clicking on them to edit them or clicking and dragging them to move them around.
          Press the save icon or the button above to save your changes.
        </p>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
	methods: {
		exitEditMode() {
			this.$store.dispatch('tilePad/setEditMode', false);
		}
	}
};
</script>
<style scoped>
.sentenceCardContainer {
  position: -webkit-sticky;
  position: sticky;
  top: 56px;
  z-index: 100;
  padding: 5px;
  background-color: white;
}
</style>
