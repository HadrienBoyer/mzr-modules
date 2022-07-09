"use strict";

class mzruiKeysforms extends mzruiSVGDefs {
	update( id, keys, dur ) {
		return super.update( id, dur, 1, ...mzruiKeysforms.#render( keys ) );
	}

	static #render( keys ) {
		const arrKeys = Object.values( keys );
		const { min, size } = mzruiKeysforms.#calcMinMax( arrKeys );
		const rowH = 1 / ( size + 1 );

		return arrKeys.map( k => MZRUI.$createElementSVG( "rect", {
			x: k.when,
			y: ( size - k.key + min ) * rowH,
			width: k.duration,
			height: rowH,
		} ) );
	}
	static #calcMinMax( arrKeys ) {
		let min = Infinity;
		let max = -Infinity;

		arrKeys.forEach( k => {
			min = Math.min( min, k.key );
			max = Math.max( max, k.key );
		} );
		min -= min % 12;
		max += 11 - max % 12;
		return { min, size: max - min };
	}
}

Object.freeze( mzruiKeysforms );
