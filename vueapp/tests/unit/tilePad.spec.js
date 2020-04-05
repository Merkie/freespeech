import { expect } from 'chai';
import tilePad from '@/store/modules/tilePad';


describe('tilePad.js', () => {
	const { LOG_TILE_TAP } = tilePad.mutations;

	it('Logs tap on tile on empty tile tap count', () => {
		const state = { tileTapsCount: [] };
		LOG_TILE_TAP(state, 1);
		expect(state.tileTapsCount.length).to.equal(1);
		expect(state.tileTapsCount[0].taps).to.equal(1);
		expect(state.tileTapsCount[0].id).to.equal(1);
	});

	it('should increase by 1 taps on for tile count with id equals to 1', () => {
		const state = { tileTapsCount: [{ id: 1,
			taps: 4 }] };
		LOG_TILE_TAP(state, 1);
		expect(state.tileTapsCount.length).to.equal(1);
		expect(state.tileTapsCount[0].taps).to.equal(5);
	});

});



