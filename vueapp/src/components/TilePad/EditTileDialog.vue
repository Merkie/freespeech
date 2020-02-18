<template>
  <v-dialog
    v-model="editDialogVisibility"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline"> <v-icon>edit</v-icon>Edit</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form>
                <v-text-field
                  :value="currentTileBeingEdited.name"
                  @input="update('name', $event)"
                  label="Name"
                />
                <v-text-field
                  :value="currentTileBeingEdited.image"
                  @input="update('image', $event)"
                  label="Image URL"
                />
                <v-img
                  max-height="32"
                  max-width="32"
                  aspect-ratio="1"
                  :src="currentTileBeingEdited.image"
                />
                <v-text-field 
                  class="pt-5"
                  :value="currentTileBeingEdited.text"
                  @input="update('text', $event)"
                  label="Text to speak"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="saveCurrentEdit"          
        >
          Save
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="toggleEditDialogVisibility"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name:'EditTileDialog',
  computed: {
    ...mapGetters({
      editDialogVisibility: 'tilePad/editDialogVisibility',
      currentTileBeingEdited: 'tilePad/currentTileBeingEdited'      
    }),
  },
  methods: {
    ...mapActions({
      toggleEditDialogVisibility: 'tilePad/toggleEditDialogVisibility',
      saveTileEdit: 'tilePad/saveTileEdit',
      saveEditsToTileBeingEdited: 'tilePad/saveEditsToTileBeingEdited'
    }),
    saveCurrentEdit(){
      this.saveTileEdit();
      this.toggleEditDialogVisibility();
    },
    update(key, value){      
      this.saveEditsToTileBeingEdited({'key': key, 'value': value});
    }
    
  },
    //this.editedTileValues = Object.assign({}, this.currentTileBeingEdited);


};
</script>

<style>

</style>