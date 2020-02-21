<template>
	<v-btn
		raised
		tile
		class="mx-auto"
		:color="typeof tileData.accent === 'undefined' ? '' : cardColor"
		style="height: unset"
		@click="tileClickedEvent"
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
					:src="tileData.image"
				/>
			</v-row>
			<v-row>
				<v-card-text
					class
					align="center"
					justify="center"
				>
					<h3>{{ tileData.name }}</h3>
				</v-card-text>
			</v-row>
		</v-container>
	</v-btn>
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
			switch (this.localeTileData.accent) {
			case 'red':
				return '#FF9AA2';
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
			default:
				return this.localeTileData.accent;
			}
		},
		localeTileData() {
			const messages = this.tileData.messages;
			if (typeof messages !== 'undefined' && typeof messages[this.locale] === 'object') {
				return { ...this.tileData,
					...messages[this.locale] };
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
