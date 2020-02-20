const state = {
  customTilePad: true,
  locale: 'en',
  locked: false,
  passcode: null,
  selectedVoiceIndex: 0,
  sentenceMode: true,
  voices: [],
  voiceOptions: [],
};

const mutations = {
  SET_LOCALE(state, value){
    state.locale = value;
  },
  SET_LOCKED(state, value){
    state.locked = value;
  },
  SET_PASSCODE(state, value){
    state.passcode = value;
  },
  SET_SELECTED_VOICE_INDEX(state, value){
    state.selectedVoiceIndex = value;
  },
  SET_VOICES(state, value){
    state.voices = value;
  },
  SET_VOICE_OPTIONS(state, value){
    state.voiceOptions = value;
  },
  TOGGLE_CUSTOM_TILE_PAD(state){
    state.customTilePad = !state.customTilePad;
  },
  TOGGLE_SENTENCE_MODE(state){
    state.sentenceMode = !state.sentenceMode;
  },
};

const actions = {
  setLocale: ({commit}, value) => {
    commit('SET_LOCALE', value);
  },
  setLocked: ({commit}, value) => {
    commit('SET_LOCKED', value);
  },
  setPasscode: ({commit}, value) => {
    commit('SET_PASSCODE', value);
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
  toggleCustomTilePad: ({commit}) => {
    commit('TOGGLE_CUSTOM_TILE_PAD');
  },
  toggleLocked: ({commit, state}) => {
    commit('SET_LOCKED', !state.locked);
  },
  toggleSentenceMode: ({commit}) => {
    commit('TOGGLE_SENTENCE_MODE');
  },
};

const getters = {
  customTilePad: state => state.customTilePad,
  locale: state => state.locale,
  locked: state => state.locked,
  passcode: state => state.passcode,
  selectedVoiceIndex: state => state.selectedVoiceIndex,
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
