import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import EditModeHeader from '@/components/EditModeHeader/EditModeHeader';
import tilePad from '@/store/modules/tilePad';

//Using clonedeep cause if you dont store values move over in each test
const cloneDeep = require('clone-deep');
const localVue = createLocalVue();
localVue.use(Vuex);

function getWrapper () {
	return shallowMount(EditModeHeader, {
		localVue,
		store: new Vuex.Store({
			modules: {
				tilePad: cloneDeep(tilePad),
			},
		}),
		mocks: {
			$t: () => 'Save Changes',
		},
	});
}

describe('EditModeHeader.Vue', () => {
	let wrapper; 

	beforeEach(() => {
		wrapper = getWrapper();
		wrapper.vm.$store.commit('tilePad/SET_EDIT_MODE', true);

	});
    
	it('Save changes button exits edit mode', () => {
		let button = wrapper.find('#exitEditModeButton');
		expect(button.exists()).to.be.true;
		button.trigger('click');
		expect(wrapper.vm.$store.state.tilePad.editMode).to.be.false;
	});
});
