const state = {
	customTilePadData: {},
	editMode: false,
	editDialogVisibility: false,
	currentTileBeingEdited: {},
	tileTapsCount: []
};

const mutations = {
	SET_CUSTOM_TILE_PAD_DATA (state, value) {
		state.customTilePadData = value;
	},
	TOGGLE_EDIT_MODE (state) {
		state.editMode = !state.editMode;
	},
	TOGGLE_EDIT_DIALOG_VISIBILITY (state) {
		state.editDialogVisibility = !state.editDialogVisibility;
	},
	SET_CURRENT_TILE_BEING_EDITED (state, value) {
		state.currentTileBeingEdited = value;
	},
	SAVE_EDITS_TO_TILE_BEING_EDITED (state, value) {
		state.currentTileBeingEdited[value.key] = value.value;
	},
	SET_TILE_BEING_EDITED (state) {
		let indexOfTileInCustomTilePadData = state.customTilePadData[state.currentTileBeingEdited.page].tileData.findIndex(tile => tile.id == state.currentTileBeingEdited.id);
		state.customTilePadData[state.currentTileBeingEdited.page].tileData.splice(indexOfTileInCustomTilePadData, state.currentTileBeingEdited);
	},
	SET_EDIT_MODE (state, value) {
		state.editMode = value;
	},
	LOG_TILE_TAP(state, value) {
		const indexOfTile = state.tileTapsCount.findIndex((obj) => obj.id == value);
		if (indexOfTile >= 0)
			state.tileTapsCount[indexOfTile].taps++;
		else {
			const tile = { id: value,
				taps: 1 };
			state.tileTapsCount.push(tile);
		}
	},
	CREATE_NEW_TILE(state, value){
		let maxid = 0;
		state.customTilePadData[state.currentTileBeingEdited.page].tileData.map(function(obj){     
			if (obj.id > maxid) maxid = obj.id;    
		});
		value.id = maxid + 1;
		state.customTilePadData[state.currentTileBeingEdited.page].tileData.unshift(value);
		state.currentTileBeingEdited = {};
	}
};

const actions = {
	setCustomTilePadData: ({ commit }, value) => {
		commit('SET_CUSTOM_TILE_PAD_DATA', value);
	},
	toggleEditMode: ({ commit }) => {
		commit('TOGGLE_EDIT_MODE');
	},
	toggleEditDialogVisibility: ({ commit }) => {
		commit('TOGGLE_EDIT_DIALOG_VISIBILITY');
	},
	setCurrentTileBeingEdited: ({ commit }, value) => {
		commit('SET_CURRENT_TILE_BEING_EDITED', value);
	},
	saveEditsToTileBeingEdited: ({ commit }, value) => {
		commit('SAVE_EDITS_TO_TILE_BEING_EDITED', value);
	},
	saveTileEdit: ({ commit }) => {
		commit('SET_TILE_BEING_EDITED');
	},
	setEditMode: ({ commit }, value) => {
		commit('SET_EDIT_MODE', value);
	},
	logTileTap: ({ commit }, value) => {
		commit('LOG_TILE_TAP', value);
	}
};

const getters = {
	customTilePadData: (state) => state.customTilePadData,
	editMode: (state) => state.editMode,
	editDialogVisibility: (state) => state.editDialogVisibility,
	currentTileBeingEdited: (state) => state.currentTileBeingEdited,
	tileTapsCount: (state) => state.tileTapsCount,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
