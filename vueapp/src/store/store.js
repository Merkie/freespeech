import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import settingsModule from './modules/settings';
import tilePadModule from './modules/tilePad';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
});

export default new Vuex.Store({
	modules: {
		settings: settingsModule,
		tilePad: tilePadModule
	},
	plugins: [vuexLocal.plugin]
});
