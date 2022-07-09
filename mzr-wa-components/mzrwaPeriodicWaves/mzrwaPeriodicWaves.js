"use strict";

class mzrwaPeriodicWaves {
	static list = new Map();
	static #cache = new Map();

	static clearCache() {
		mzrwaPeriodicWaves.#cache.clear();
	}
	static get( ctx, name ) {
		let p = mzrwaPeriodicWaves.#cache.get( name );

		if ( !p ) {
			const w = mzrwaPeriodicWaves.list.get( name );

			p = ctx.createPeriodicWave( w.real, w.imag );
			mzrwaPeriodicWaves.#cache.set( name, p );
		}
		return p;
	}
	static loadWaves( waves ) {
		waves.forEach( ( [ name, w ] ) => {
			const imag = w.imag || w.real.map( () => 0 );
			const real = w.real || w.imag.map( () => 0 );

			real[ 0 ] =
			imag[ 0 ] = 0;
			mzrwaPeriodicWaves.list.set( name, Object.freeze( {
				real: new Float32Array( real ),
				imag: new Float32Array( imag ),
			} ) );
		} );
		return mzrwaPeriodicWaves.list;
	}
}
