<!-- Add a new tile button, appears in edit mode -->
<template>
	<v-btn
		raised
		tile
		class="mx-auto"
		:color="typeof localeTileData.accent === 'undefined' ? '#FFFFFFFF' : cardColor"
		style="height: unset"
		@click="tileClickedEvent"
	>
		<v-container
			v-if="newTile"
			justify="center"
		>
			<v-row
				align="center"
				justify="center"
			>
				<v-img
					max-height="32"
					max-width="32"
					aspect-ratio="1"					
					src="https://img.icons8.com/officexs/64/000000/plus-math.png"
				/>
			</v-row>
			<v-row>
				<v-card-text
					class
					align="center"
					justify="center"
				>
					<h4>Add a New Tile</h4>
				</v-card-text>
			</v-row>
		</v-container>
		<v-container
			v-else
			justify="center"
		>
			<span
				v-if="displayTapCount && !editMode"
				class="taps-count"
			>{{
				taps
			}}</span>
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
					class
					align="center"
					justify="center"
				>
					<h3>{{ localeTileData.name }}</h3>
					<img
						v-if="editMode"
						id="drag-handle"
						src="https://img.icons8.com/officexs/16/000000/resize-four-directions.png"
						style="padding-top: 8px; margin-bottom: -12px;"
					>
				</v-card-text>
			</v-row>
		</v-container>
	</v-btn>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

/* Tile creation */
export default {
	name: 'Tile',
	props: {
		tileData: {
			type: Object,
			default() {
				return {
					/* All attributes from json file for each tile object */
					name: '',
					text: '',
					accent: '',
					image: '',
					id: 0,
					messages: {},
				};
			},
		},
		tilePage: {
			type: String,
			default: '',
		},
		inSentenceComponent: {
			type: Boolean,
			default: false,
		},
		sentenceIndex: {
			type: Number,
			default: null
		},
		newTile:{
			type: Boolean,
			default: false
		}	
	},
	computed: {
		...mapState('settings', ['sentenceMode']),
		...mapGetters({
			editMode: 'tilePad/editMode',
			locale: 'settings/locale',
			displayTapCount: 'settings/displayTapCount',
			tileTapsCount: 'tilePad/tileTapsCount',
		}),
		
		/* Make card color, if hex value return that. */
		//Might delete this feature and replace with just listed accents for simplicity.
		cardColor: function () {
			switch (this.localeTileData.accent) {
			case 'blush':
				return '#FFB7B2';
			case 'peach':
				return '#FFB7B2';
			case 'pear':
				return '#E2F0CB';
			case 'mint':
				return '#B5EAD7';
			case 'violet':
				return '#C7CEEA';
			case 'white':
				return '#FFFFFF';
			default:
				return '#FFFFFF';
			}
		},
		localeTileData() {
			const messages = this.tileData.messages;
			if (
				typeof messages !== 'undefined' &&
        typeof messages[this.locale] === 'object'
			) {
				return { ...this.tileData,
					...messages[this.locale] };
			} else {
				return this.tileData;
			}
		},
		taps() {
			const indexOfTile = this.tileTapsCount.findIndex(
				(obj) => obj.id == this.tileData.id
			);
			if (indexOfTile == -1) return 0;
			return this.tileTapsCount[indexOfTile].taps;
		},
	},
	methods: {
		...mapActions('tilePad', [
			'toggleEditDialogVisibility', 
			'setCurrentTileBeingEdited',
			'createNewTile',
			'logTileTap']),
		tileClickedEvent() {
			let keyboardTile =
        typeof this.tileData.navigation !== 'undefined' &&
        this.tileData.navigation !== '';

			if (this.editMode) {
				// if in edit tiles mode
				let tileDataToEdit = this.tileData;
				tileDataToEdit.page = this.tilePage;
				if(this.newTile){
					tileDataToEdit.newTile = true;
				}
				this.setCurrentTileBeingEdited(tileDataToEdit);
				this.toggleEditDialogVisibility();
			} else if (this.sentenceMode && !keyboardTile) {
				// if in sentence mode
				if (this.inSentenceComponent) {
					// if its in the sentence component, remove it from the sentence
					this.$emit('removeFromSentence', this.sentenceIndex);
				} else {
					// if its not in the sentence component, speak it and add it to the sentence
					this.$emit('speakText', this.localeTileData.text);
					this.$emit('addToSentence', this.localeTileData);
				}
			} else if (keyboardTile) {
				this.$router.push({
					name: 'tilePadWithRoute',
					params: { layout: this.tileData.navigation },
				});
			} else {
				this.$emit('speakText', this.localeTileData.text);
				this.logTileTap(this.localeTileData.id);
			}
		},
	},
};
</script>
<style>
.taps-count {
  position: absolute;
  bottom: 3px;
  right: 3px;
}
</style>
