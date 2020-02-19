
const state = {
  customTilePadData: {},
  editMode: false,
  editDialogVisibility: false,
  currentTileBeingEdited: {},
  sentenceMode: false
};

const mutations = {
  SET_CUSTOM_TILE_PAD_DATA(state, value) {
    state.customTilePadData = value;
  },
  TOGGLE_EDIT_MODE(state){
    state.editMode = !state.editMode;
  },
  TOGGLE_SENTENCE_MODE(state){
    state.sentenceMode = !state.sentenceMode;
  },
  TOGGLE_EDIT_DIALOG_VISIBILITY(state){
    state.editDialogVisibility = !state.editDialogVisibility;
  },
  SET_CURRENT_TILE_BEING_EDITED(state, value){
    state.currentTileBeingEdited = value;
  },
  SAVE_EDITS_TO_TILE_BEING_EDITED(state, value){
    state.currentTileBeingEdited[value.key] = value.value;
  },
  SET_TILE_BEING_EDITED(state){    
    let indexOfTileInCustomTilePadData = state.customTilePadData[state.currentTileBeingEdited.page].tileData.findIndex(tile => tile.id == state.currentTileBeingEdited.id);
    state.customTilePadData[state.currentTileBeingEdited.page].tileData.splice(indexOfTileInCustomTilePadData, state.currentTileBeingEdited);
  },
  SET_EDIT_MODE(state, value){
    state.editMode = value;
  }
};

const actions = {  
  setCustomTilePadData: ({commit}, value) => {
    commit('SET_CUSTOM_TILE_PAD_DATA', value);
  },
  toggleEditMode: ({commit}) => {
    commit('TOGGLE_EDIT_MODE');
  },
  toggleSentenceMode: ({commit}) => {
    commit('TOGGLE_SENTENCE_MODE');
  },
  toggleEditDialogVisibility: ({commit}) => {   
    commit('TOGGLE_EDIT_DIALOG_VISIBILITY');
  },
  setCurrentTileBeingEdited: ({commit}, value) => {
    commit('SET_CURRENT_TILE_BEING_EDITED', value);
  },
  saveEditsToTileBeingEdited: ({commit}, value) => {
    commit('SAVE_EDITS_TO_TILE_BEING_EDITED', value);
  },
  saveTileEdit: ({commit}) => {
    commit('SET_TILE_BEING_EDITED');
  },
  setEditMode: ({commit}, value) => {
    commit('SET_EDIT_MODE', value);
  }
};

const getters = {
  customTilePadData: state => state.customTilePadData,
  editMode: state => state.editMode,
  editDialogVisibility: state => state.editDialogVisibility,
  currentTileBeingEdited: state => state.currentTileBeingEdited
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
