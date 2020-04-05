<template>
	<div class="sentenceCardContainer grey lighten-5">
		<v-card
			outlined
			class="px-4 sentenceCard"
		>
			<v-card-title>
				{{ $t('editMode.title') }}
				<v-spacer />
				<v-btn
					id="exitEditModeButton"
					class="mx-2"
					color="success"
					@click.native="exitEditMode"
				>
					<v-icon class="pr-2">
						save
					</v-icon>
					{{ $t('editMode.buttonSave') }}
				</v-btn>
			</v-card-title>
			<v-container class="py-0">
				<p class="body-2">
					{{ $t('editMode.instructions') }}
				</p>
			</v-container>
		</v-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	methods: {
		...mapActions('tilePad', ['setEditMode']),
		exitEditMode() {
			this.setEditMode(false);
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