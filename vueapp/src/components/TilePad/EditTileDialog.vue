<template>
	<v-dialog
		v-model="editDialogVisibility"
		persistent
		max-width="600px"
	>
		<v-card>
			<v-card-title>
				<span class="headline"> <v-icon>edit</v-icon>{{ $t('editMode.tile.title') }}</span>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12">
							<v-form>
								<v-text-field
									:value="currentTileBeingEdited.name"
									:label="$t('editMode.tile.name')"
									@input="update('name', $event)"
								/>
								<v-text-field
									:value="currentTileBeingEdited.image"
									:label="$t('editMode.tile.imageUrl')"
									@input="update('image', $event)"
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
									:label="$t('editMode.tile.textToSpeak')"
									@input="update('text', $event)"
								/>
								<p class="text-left">
									{{ $t('editMode.tile.accentColor') }}
								</p>
								<v-color-picker
									v-model="color"
									hide-inputs
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
					{{ $t('editMode.tile.buttonSave') }}
				</v-btn>

				<v-btn
					color="blue darken-1"
					text
					@click="toggleEditDialogVisibility"
				>
					{{ $t('editMode.tile.buttonClose') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'EditTileDialog',
	data () {
		return {
			color: '',
		};
	},
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
		saveCurrentEdit () {
			this.saveEditsToTileBeingEdited({
				key: 'accent',
				value: this.color
			});
			this.saveTileEdit();
			this.toggleEditDialogVisibility();
		},
		update (key, value) {
			this.saveEditsToTileBeingEdited({
				'key': key,
				'value': value
			});
		}

	}
};
</script>

<style>

</style>
