"use strict";

class mzruiWaveforms extends mzruiSVGDefs {
	#isHD = false;

	hdMode( b ) {
		this.#isHD = b;
	}
	update( id, buf ) {
		const polygon = MZRUI.$createElementSVG( "polygon" );
		const w = this.#isHD ? 260 : buf.duration * 48 | 0;
		const h = 48;

		mzruiWaveform.drawBuffer( polygon, w, h, buf );
		return super.update( id, w, h, polygon );
	}
	setSVGViewbox( svg, x, w, bps ) {
		const res = this.#isHD ? 260 : 48 / bps;

		return super.setSVGViewbox( svg, x * res, w * res );
	}
}

Object.freeze( mzruiWaveforms );
