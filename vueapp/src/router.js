import Vue from 'vue';
import Router from 'vue-router';
import TilePad from './views/TilePad.vue';
import About from './views/About.vue';
import Settings from './views/Settings.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/layout/:layout',
			name: 'tilePadWithRoute',
			component: TilePad,
			props: true
		},
		{
			path: '/',
			name: 'tilePad',
			component: TilePad
		},
		{
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings
		}
	]
});
