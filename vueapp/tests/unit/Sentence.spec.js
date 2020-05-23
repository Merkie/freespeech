import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Sentence from '@/components/Sentence/Sentence';
import Tile from '@/components/TilePad/Tile.vue';
import i18n from '@/i18n';
import Vuetify from 'vuetify/lib';
import VueRouter from 'vue-router';
import TilePad from '@/views/TilePad';

const routes =[{
	path: '/layout/:layout',
	name: 'tilePadWithRoute',
	component: TilePad,
	props: true
}];
const router = new VueRouter({ routes });

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(VueRouter);
const tilePadToDisplay = [
	{
		'name': 'No',
		'text': 'No',
		'accent': 'peach',
		'image': 'https://img.icons8.com/officexs/64/000000/cancel-2.png',
		'id': 0,
		'messages': {
			'de': {
				'name': 'Nein',
				'text': 'nein'
			}
		}
	},
	{
		'name': 'Little',
		'text': 'Little',
		'image': 'https://img.icons8.com/officexs/64/000000/cursor.png',
		'id': 1,
		'accent': 'white',
		'messages': {
			'de': {
				'name': 'Klein',
				'text': 'klein'
			}
		}
	},
	{
		'name': 'Off',
		'text': 'Off',
		'image': 'https://img.icons8.com/officexs/64/000000/disclaimer.png',
		'id': 2,
		'accent': 'white',
		'messages': {
			'de': {
				'name': 'Aus',
				'text': 'aus'
			}
		}
	},
];
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

function getWrapper () {
	return shallowMount(Sentence, {
		localVue,
		router: router,
		propsData:{
			tilePadToDisplay
		},
		i18n,
		vuetify
	});
}

describe('Sentence.vue', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper();
	});
    
	it('Amount of tiles match tiles shown and tiles are populated', async () => {
		let tiles = wrapper.findAll(Tile);
		expect(tiles.exists()).to.be.true;
		expect(tiles.length).to.equal(3);
	});
});