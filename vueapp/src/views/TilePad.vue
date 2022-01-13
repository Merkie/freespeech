<template>
	<div>
		<Sentence
			v-if="sentenceMode && !editMode"
			:tile-pad-to-display="sentenceTiles"
			@clearSentence="sentenceTiles = []"
			@speakSentence="speakSentence"
			@removeFromSentence="sentenceTiles.splice($event, 1)"
		/>
		<edit-mode-header
			v-if="editMode"
		/>
		<v-container
			fluid
			class="grey lighten-5 pb-10"
			style="{text-align: center}"
		>
			<v-row dense>
				<Tile
					v-if="editMode"
					id="newTile"
					:new-tile="true"			
					:tile-page="currentTilePadPage"
				/>

			</v-row>
			<v-row dense>
				<draggable
					v-model="tilePadToDisplay.tileData"
					style="display: contents"
					:options="{disabled: !editMode, handle: '#drag-handle'}"
					class="tilePadContainer"
				>
					<template  v-for="(tile, tileIndex) in !extraMode ? tilePadToDisplay.tileData.slice(tilePadToDisplay.tileData.length-60) : tilePadToDisplay.tileData">
						<v-col
							:key="tileIndex + 1"
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
								:tile-data="tile"
								:tile-page="currentTilePadPage"
								@speakText="speakText"
								@addToSentence="sentenceTiles.push($event)"
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
	data () {
		return {
			tileData: TileData,
			sentenceTiles: [],
		};
	},
	computed: {
		...mapState('settings', ['sentenceMode', 'extraMode']),
		...mapState('tilePad', ['editMode']),
		...mapGetters({
			selectedVoiceIndex: 'settings/selectedVoiceIndex',
			customTilePadOption: 'settings/customTilePad',
			customTilePadData: 'tilePad/customTilePadData',
			voices: 'settings/voices',
		}),
		tilePadToDisplay: function () {
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
		currentTilePadPage () {
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
			logTileTap: 'tilePad/logTileTap',
		}),
		speakText (textToSpeak) {
			SPEECH_SYNTHESIS.cancel();
			let speechSynthesisUtterance = new SpeechSynthesisUtterance(textToSpeak);

			speechSynthesisUtterance.voice = this.voices[this.selectedVoiceIndex];
			SPEECH_SYNTHESIS.speak(speechSynthesisUtterance);
		},
		/**
			 * Speaks the sentence that is currently in the sentenceTiles variable
			 */
		speakSentence () {
			let textToSpeak = this.sentenceTiles.map(tile => tile.text).join(' ');
			this.speakText(textToSpeak);
			this.logTaps();
		},
		logTaps () {
			this.sentenceTiles.forEach(tile => {
				this.logTileTap(tile.id);
			});
		}
	}
};
</script>
