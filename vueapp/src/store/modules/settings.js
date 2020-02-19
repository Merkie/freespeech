const state = {
  selectedVoiceIndex: 0,
  voices: [],
  voiceOptions: [],
  settingsDialogVisibility: false,
  customTilePad: true,
  sentenceMode: true
};

const mutations = {
  SET_SELECTED_VOICE_INDEX(state, value){
    state.selectedVoiceIndex = value;
  },
  SET_VOICES(state, value){
    state.voices = value;
  },
  SET_VOICE_OPTIONS(state, value){
    state.voiceOptions = value;
  },
  TOGGLE_SETTINGS_DIALOG_VISIBILITY(state){
    state.settingsDialogVisibility = !state.settingsDialogVisibility;
  },
  TOGGLE_CUSTOM_TILE_PAD(state){
    state.customTilePad = !state.customTilePad;
  },
  TOGGLE_SENTENCE_MODE(state){
    state.sentenceMode = !state.sentenceMode;
  },
};

const actions = {
  toggleSentenceMode: ({commit}) => {
    commit('TOGGLE_SENTENCE_MODE');
  },
  setSelectedVoiceIndex: ({commit}, value) => {
    commit('SET_SELECTED_VOICE_INDEX', value);
  },
  setVoices: ({commit}, value) => {
    commit('SET_VOICES', value);
  },
  setVoiceOptions: ({commit}, value) => {
    commit('SET_VOICE_OPTIONS', value);
  },
  toggleSettingsDialogVisibility: ({commit}) => {
    commit('TOGGLE_SETTINGS_DIALOG_VISIBILITY');
  },
  toggleCustomTilePad: ({commit}) => {
    commit('TOGGLE_CUSTOM_TILE_PAD');
  }
};

const getters = {
  settingsDialogVisibility: state => state.settingsDialogVisibility,
  selectedVoiceIndex: state => state.selectedVoiceIndex,
  customTilePad: state => state.customTilePad,
  voices: state => state.voices,
  voiceOptions: state => state.voiceOptions,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};