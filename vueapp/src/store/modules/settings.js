const state = {
  selectedVoiceIndex: 0,
  settingsDialogVisibility: false,
  customTilePad: true
};

const mutations = {
  SET_SELECTED_VOICE_INDEX(state, value) {
    state.selectedVoiceIndex = value;
  },
  TOGGLE_SETTINGS_DIALOG_VISIBILITY(state) {
    state.settingsDialogVisibility = !state.settingsDialogVisibility;
  },
  TOGGLE_CUSTOM_TILE_PAD(state){
    state.customTilePad = !state.customTilePad;
  }
};

const actions = {
  setSelectedVoiceIndex: ({ commit }, value) => {
    commit('SET_SELECTED_VOICE_INDEX', value);
  },
  toggleSettingsDialogVisibility: ({ commit }) => {
    commit('TOGGLE_SETTINGS_DIALOG_VISIBILITY');
  },
  toggleCustomTilePad: ({commit}) => {
    commit('TOGGLE_CUSTOM_TILE_PAD');
  }
};

const getters = {
  settingsDialogVisibility: state => state.settingsDialogVisibility,
  selectedVoiceIndex: state => state.selectedVoiceIndex,
  customTilePad: state => state.customTilePad
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
