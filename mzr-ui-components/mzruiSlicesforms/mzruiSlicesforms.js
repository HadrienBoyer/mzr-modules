"use strict";

class mzruiSlicesforms extends mzruiSVGDefs {
	update( id, slices, dur ) {
		return super.update( id, dur, 1, ...mzruiSlicesforms.#render( slices, dur ) );
	}

	static #render( slices, dur ) {
		return Object.values( slices ).map( sli => [
			mzruiSlicesforms.#renderSliceRect( sli, dur, null ),
			mzruiSlicesforms.#renderSliceRect( sli, dur, .25 ),
		] ).flat( 1 );
	}
	static #renderSliceRect( { x, y, w }, dur, opacity ) {
		return MZRUI.$createElementSVG( "rect", {
			x: dur * x,
			y,
			opacity,
			width: dur * ( w - .005 ),
			height: opacity === null ? .05 : 1 - y,
		} );
	}
}

Object.freeze( mzruiSlicesforms );
