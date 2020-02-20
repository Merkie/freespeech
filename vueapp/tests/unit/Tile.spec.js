import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Tile from '@/components/TilePad/Tile.vue';
import settings from '@/store/modules/settings';
import tilePad from '@/store/modules/tilePad';

const localVue = createLocalVue();
localVue.use(Vuex);

function getWrapper () {
  return shallowMount(Tile, {
    localVue,
    store: new Vuex.Store({
      modules: {
        tilePad,
        settings
      },
    }),
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
});

describe ('Tile.vue (edit mode)', () => {
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
});
