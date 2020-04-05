const state = {
	customTilePad: true,
	locale: null,
	locked: false,
	passcode: null,
	selectedVoiceIndex: null,
	sentenceMode: true,
	voices: [],
	voiceOptions: [], 
	displayTapCount: false,
};

const mutations = {
	SET_CUSTOM_TILE_PAD(state, value){
		state.customTilePad = value;
	},
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
	SET_SENTENCE_MODE(state, value){
		state.sentenceMode = value;
	},
	SET_VOICES(state, value){
		state.voices = value;
	},
	SET_VOICE_OPTIONS(state, value){
		state.voiceOptions = value;
	},
	SET_DISPLAY_TAP_COUNT: (state, value) => {
		state.displayTapCount = value;
	}
};

const actions = {
	setCustomTilePad: ({ commit }, value) => {
		commit('SET_CUSTOM_TILE_PAD', value);
	},
	setLocale: ({ commit }, value) => {
		commit('SET_LOCALE', value);
	},
	setLocked: ({ commit }, value) => {
		commit('SET_LOCKED', value);
	},
	setPasscode: ({ commit }, value) => {
		commit('SET_PASSCODE', value);
	},
	setSelectedVoiceIndex: ({ commit }, value) => {
		commit('SET_SELECTED_VOICE_INDEX', value);
	},
	setSentenceMode: ({ commit }, value) => {
		commit('SET_SENTENCE_MODE', value);
	},
	setVoices: ({ commit }, value) => {
		commit('SET_VOICES', value);
	},
	setVoiceOptions: ({ commit }, value) => {
		commit('SET_VOICE_OPTIONS', value);
	},
	toggleCustomTilePad: ({ commit, state }) => {
		commit('SET_CUSTOM_TILE_PAD', !state.customTilePad);
	},
	toggleLocked: ({ commit, state }) => {
		commit('SET_LOCKED', !state.locked);
	},
	toggleSentenceMode: ({ commit, state }) => {
		commit('SET_SENTENCE_MODE', !state.sentenceMode);
	},
	setDisplayTapCount: ({ commit }, value) => {
		commit('SET_DISPLAY_TAP_COUNT', value);
	}
};

const getters = {
	customTilePad: (state) => state.customTilePad,
	locale: (state) => state.locale,
	locked: (state) => state.locked,
	passcode: (state) => state.passcode,
	selectedVoiceIndex: (state) => state.selectedVoiceIndex,
	voices: (state) => state.voices,
	voiceOptions: (state) => state.voiceOptions,
	displayTapCount: (state) => state.displayTapCount,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
