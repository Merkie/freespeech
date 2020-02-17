import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })
  
export default new Vuex.Store({
    state: {
        selectedVoiceIndex: 0,
        settingsDialogVisibility: false,

    },
    mutations: {
        SET_SELECTED_VOICE_INDEX(state, value){
            state.selectedVoiceIndex = value;
        },
        TOGGLE_SETTINGS_DIALOG_VISIBILITY(state){
            state.settingsDialogVisibility = !state.settingsDialogVisibility;
        }
    },
    actions: {
        setselectedVoiceIndex: ({commit}, value) => {
            commit('SET_SELECTED_VOICE_INDEX', value);
        },
        toggleSettingsDialogVisibility: ({commit}) => {
            commit('TOGGLE_SETTINGS_DIALOG_VISIBILITY');
        } 
    },
    getters:{
        settingsDialogVisibility: state => state.settingsDialogVisibility,
        selectedVoiceIndex: state => state.selectedVoiceIndex
    },
    plugins: [vuexLocal.plugin]
});
