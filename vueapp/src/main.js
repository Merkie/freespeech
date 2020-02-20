import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import router from './router';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import i18n from './i18n';

Vue.config.productionTip = false;

new Vue({
	store,
	router,
	vuetify,
	i18n,
	render: h => h(App)
}).$mount('#app');
