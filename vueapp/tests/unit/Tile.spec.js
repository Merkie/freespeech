import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Tile from '@/components/TilePad/Tile.vue';
import settings from '@/store/modules/settings';
import tilePad from '@/store/modules/tilePad';
import VueRouter from 'vue-router';
import TilePad from '@/views/TilePad';

const routes = [{
	path: '/layout/:layout',
	name: 'tilePadWithRoute',
	component: TilePad,
	props: true
}];
const sentenceModePropsData = {
	name: 'Test Key Board Tile',
	text: ' ',
	accent: 'mint',
	image: 'https://img.icons8.com/officexs/64/000000/keyboard.png',
	navigation: 'keyboard',
	id: 11,
};

const router = new VueRouter({ routes });
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

function getWrapper () {
	return shallowMount(Tile, {
		localVue,
		store: new Vuex.Store({
			modules: {
				tilePad,
				settings
			},
		}),
		router: router,
		propsData: {
			tileData: {
				name: 'Test',
				text: 'Test Tile',
				accent: 'peach',
				image: 'https://img.icons8.com/officexs/64/000000/cancel-2.png',
				id: 0
			},
			tilePage: 'home',
			inSentenceComponent: false,
			sentenceIndex: null
		}
	});
}

describe('Tile.vue', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper();
	});

	it('emits speakText event when clicked', async () => {
		wrapper.vm.tileClickedEvent();
		await wrapper.vm.$nextTick();
		const emitted = wrapper.emitted().speakText;
		expect(emitted.length).to.equal(1);
		expect(emitted[0].length).to.equal(1);
		expect(emitted[0][0]).to.equal('Test Tile');
	});

	it('has a tileData object', () => {
		expect(wrapper.vm.tileData).to.be.an('object');
	});

	it('sets tile color based on accent string', () => {
		expect(wrapper.vm.cardColor).to.equal('#FFB7B2');
	});

	it('Keyboard tile opens on click', async () => {
		wrapper.setProps({ tileData: sentenceModePropsData });
		wrapper.vm.tileClickedEvent();
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$route.params.layout).to.equal(sentenceModePropsData.navigation);
	});

	it('drag handle is not visible', async () => {
		expect(wrapper.find('#drag-handle').exists()).to.be.false;
	});
});

describe('Tile.vue (edit mode)', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper();
		wrapper.vm.$store.commit('tilePad/SET_EDIT_MODE', true);
	});

	it('opens edit dialog when clicked', async () => {
		wrapper.vm.tileClickedEvent();
		expect(wrapper.vm.$store.state.tilePad.currentTileBeingEdited.name).to.equal('Test');
		expect(wrapper.vm.$store.state.tilePad.editDialogVisibility).to.be.true;
	});

	it('drag handle is visible', async () => {
		expect(wrapper.find('#drag-handle').exists()).to.be.true;
	});

	it('new tile is shown', async () => {
		wrapper.vm.$store.state.tilePad.editDialogVisibility = false;
		wrapper.setProps({ newTile: true });
		wrapper.vm.tileClickedEvent();
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.$store.state.tilePad.currentTileBeingEdited.newTile).to.be.true;
		expect(wrapper.vm.$store.state.tilePad.editDialogVisibility).to.be.true;
	});
});
