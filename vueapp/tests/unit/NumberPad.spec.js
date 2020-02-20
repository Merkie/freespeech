import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import NumberPad from '@/components/NumberPad/NumberPad.vue';
import settings from '@/store/modules/settings';

const localVue = createLocalVue();
localVue.use(Vuex);

function getWrapper (propsData = {}) {
	return shallowMount(NumberPad, {
		localVue,
		store: new Vuex.Store({
			modules: {
				settings
			},
		}),
		propsData: {
			title: 'Test NumberPad',
			...propsData
		}
	});
}

describe('NumberPad.vue', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper();
	});

	it('has a title', () => {
		expect(wrapper.vm.title).to.equal('Test NumberPad');
	});

	it('starts with close button', () => {
		expect(wrapper.vm.isBackspaceEnabled).to.be.false;
	});

	it('starts with empty passcode', () => {
		expect(wrapper.vm.input).to.equal('');
	});

	it('starts with numbers active', () => {
		expect(wrapper.vm.isNumbersEnabled).to.be.true;
	});

	it('starts with save button disabled', () => {
		expect(wrapper.vm.isSaveEnabled).to.be.false;
	});

	it('appends digit to passcode when button clicked', () => {
		wrapper.vm.padInput(1);
		expect(wrapper.vm.input).to.equal('1');
	});

	it('appends digit to passcode when numeric key pressed', () => {
		const e = new KeyboardEvent('keyup', { key: '2' });
		wrapper.vm.keyboardInput(e);
		expect(wrapper.vm.input).to.equal('2');
	});

	it('removes last digit from passcode when keyboard backspace key is pressed', () => {
		wrapper.vm.padInput(1);
		wrapper.vm.padInput(2);
		const e = new KeyboardEvent('keyup', { key: 'Backspace' });
		wrapper.vm.keyboardInput(e);
		expect(wrapper.vm.input).to.equal('1');
	});

	it('replaces close button with backspace when passcode is not empty', () => {
		expect(wrapper.vm.isBackspaceEnabled).to.be.false;
	});

	it('saves when enter key pressed', async () => {
		wrapper.vm.padInput(1);
		const e = new KeyboardEvent('keyup', { key: 'Enter' });
		wrapper.vm.keyboardInput(e);
		await wrapper.vm.$nextTick();
		const emitted = wrapper.emitted().input;
		expect(emitted.length).to.equal(1);
		expect(emitted[0].length).to.equal(1);
		expect(emitted[0][0]).to.equal('1');
	});

	it('saves when save button is clicked', async () => {
		wrapper.vm.padInput(2);
		wrapper.vm.save();
		await wrapper.vm.$nextTick();
		const emitted = wrapper.emitted().input;
		expect(emitted.length).to.equal(1);
		expect(emitted[0].length).to.equal(1);
		expect(emitted[0][0]).to.equal('2');
	});
});

describe('NumberPad.vue (with length)', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper({ length: 4 });
	});

	it('does not allow saving until expected number of digits are entered', () => {
		for (let step = 1; step <= 3; step++) {
			wrapper.vm.padInput(step);
		}
		expect(wrapper.vm.isSaveEnabled).to.be.false;
	});

	it('allows saving once expected number of digits are entered', () => {
		for (let step = 1; step <= 4; step++) {
			wrapper.vm.padInput(step);
		}
		expect(wrapper.vm.isSaveEnabled).to.be.true;
	});

	it('disables number buttons once expected number of digits are entered', () => {
		for (let step = 1; step <= 4; step++) {
			wrapper.vm.padInput(step);
		}
		expect(wrapper.vm.isNumbersEnabled).to.be.false;
	});

	it('does not accept further keyboard digit entry once expected number of digits are entered', () => {
		for (let step = 1; step <= 5; step++) {
			const e = new KeyboardEvent('keyup', { key: step });
			wrapper.vm.keyboardInput(e);
		}

		expect(wrapper.vm.input).to.equal('1234');
	});
});

describe('NumberPad.vue (hidden)', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = getWrapper({ hidden: true });
	});

	it('displays correct number of placeholder characters', () => {
		for (let step = 1; step <= 3; step++) {
			wrapper.vm.padInput(step);
		}
		expect(wrapper.vm.display).to.equal(wrapper.vm.hiddenCharacter.repeat(3));
	});
});
