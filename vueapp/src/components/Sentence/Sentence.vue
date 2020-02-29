<template>
	<div class="sentenceCardContainer grey lighten-5">
		<v-card
			outlined
			class="px-4 sentenceCard"
		>
			<v-card-title>
				{{ $t('sentence.title') }}
				<v-spacer />
				<v-btn
					raised
					tile
					class="mx-auto"
					color="primary"
					style="height: unset"
					@click="$emit('speakSentence')"
				>
					<v-container
						justify="center"
					>
						<v-row
							align="center"
							justify="center"
						>
							<v-icon class="pr-2">
								record_voice_over
							</v-icon>
						</v-row>
						<v-row>
							<v-card-text
								class
								align="center"
								justify="center"
							>
								<h3>{{ $t('sentence.buttonSpeak') }}</h3>
							</v-card-text>
						</v-row>
					</v-container>
				</v-btn>
				<v-divider
					class="mx-4"
					inset
					vertical
				/>
				<v-btn
					raised
					tile
					class="mx-auto"
					color="red darken-1"
					style="height: unset; color: white;"
					@click="$emit('clearSentence')"
				>
					<v-container
						justify="center"
					>
						<v-row
							align="center"
							justify="center"
						>
							<v-icon class="pr-2">
								clear
							</v-icon>
						</v-row>
						<v-row>
							<v-card-text
								class
								align="center"
								justify="center"
							>
								<h3>{{ $t('sentence.buttonClear') }}</h3>
							</v-card-text>
						</v-row>
					</v-container>
				</v-btn>
			</v-card-title>
			<v-card-text class="py-0">
				<p
					v-if="tilePadToDisplay.length === 0"
					class="body-2"
				>
					{{ $t('sentence.instructions') }}
				</p>
				<v-row
					v-else
					dense
					class="mb-4"
				>
					<v-col
						v-for="(tile, tileIndex) in tilePadToDisplay"
						:key="tileIndex"
						:cols="
							$vuetify.breakpoint.xsOnly
								? 4
								: $vuetify.breakpoint.smAndDown
									? 3
									: 1
						"
						class="d-flex child-flex"
					>
						<Tile
							:tile-data="tile"
							in-sentence-component
							:sentence-index="tileIndex"
							@removeFromSentence="$emit('removeFromSentence', $event)"
						/>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import Tile from '@/components/TilePad/Tile';

export default {
	name: 'Sentence',
	components: {
		Tile
	},
	props: {
		tilePadToDisplay: {
			type: Array,
			default() {
				return [];
			}
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
