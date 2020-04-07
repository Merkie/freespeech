import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import tilePad from '@/store/modules/tilePad';
import TilePad from '@/views/TilePad';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify/lib';

//Using clonedeep cause if you dont store values move over in each test
const cloneDeep = require('clone-deep');
const localVue = createLocalVue();
localVue.use(Vuex);

const opts = {    
	description: 'iPhone 6 (portrait)',
	width: 375,
	height: 667,
	name: 'xs',
	mustBeTrue: [
		'xs',
		'xsOnly',
		'smAndDown',
		'mdAndDown',
		'lgAndDown',
	]
};

let vuetify = new Vuetify({
	mocks: {
		$vuetify: {
			breakpoint: opts,			
		},
	}
});
localVue.use(Vuetify);


const routes = [{
	path: '/layout/:layout',
	name: 'tilePadWithRoute',
	component: TilePad,
	props: true
}];
const router = new VueRouter({ routes });
localVue.use(VueRouter);

function getWrapper () {
	return shallowMount(TilePad, {
		localVue,
		store: new Vuex.Store({
			modules: {
				tilePad: cloneDeep(tilePad)
			},
		}),
		router,
		vuetify		
	});
}

describe('TilePad.Vue', () => {
	let wrapper; 

	beforeEach(() => {
		wrapper = getWrapper();
	});
    
	it('new tile is showing in edit mode only', async () => {
		wrapper.vm.$store.commit('tilePad/SET_EDIT_MODE', false);
		await wrapper.vm.$nextTick();
		let newTileNotDuringEditMode = wrapper.find('#newTile');
		expect(newTileNotDuringEditMode.exists()).to.be.false;

		wrapper.vm.$store.commit('tilePad/SET_EDIT_MODE', true);
		await wrapper.vm.$nextTick();
		let newTileDuringEditMode = wrapper.find('#newTile');
		expect(newTileDuringEditMode.exists()).to.be.true;
	});
});
