"use strict";

class mzrwaBPMTap {
	static #stack = [];
	static #timeBefore = 0;
	static #stackLimit = 20;

	static reset() {
		mzrwaBPMTap.#timeBefore =
		mzrwaBPMTap.#stack.length = 0;
	}
	static tap() {
		const time = Date.now();
		const timeBefore = mzrwaBPMTap.#timeBefore;

		mzrwaBPMTap.#timeBefore = time;
		if ( timeBefore ) {
			const bpm = 60000 / ( time - timeBefore );
			const stack = mzrwaBPMTap.#stack;
			const lastBpm = stack.length
				? stack[ stack.length - 1 ]
				: 0;

			if ( lastBpm && ( bpm < lastBpm / 1.5 || bpm > lastBpm * 1.5 ) ) {
				stack.length = 0;
			} else {
				if ( stack.unshift( bpm ) > mzrwaBPMTap.#stackLimit ) {
					stack.length = mzrwaBPMTap.#stackLimit;
				}
				return +( stack.reduce( ( sum, bpm ) => sum + bpm, 0 ) / stack.length ).toFixed( 2 );
			}
		}
		return 0;
	}
}
