"use strict";

class mzruiEnvelopeGraph extends HTMLElement {
	#mainLine = MZRUI.$createElementSVG( "polyline", { class: "mzruiEnvelopeGraph-mainLine" } );
	#attLine = MZRUI.$createElementSVG( "polyline", { class: "mzruiEnvelopeGraph-line" } );
	#relLine = MZRUI.$createElementSVG( "polyline", { class: "mzruiEnvelopeGraph-line" } );
	#svg = MZRUI.$createElementSVG( "svg", { preserveAspectRatio: "none" },
		this.#mainLine, this.#attLine, this.#relLine );
	#width = 0;
	#height = 0;

	constructor() {
		super();
		this.attack = .25;
		this.hold = .25;
		this.decay = .25;
		this.sustain = .8;
		this.release = 1;
		this.duration = 4;
		Object.seal( this );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( this.#svg );
			this.resized();
		}
	}

	// .........................................................................
	resized() {
		const bcr = this.getBoundingClientRect();
		const w = ~~bcr.width;
		const h = ~~bcr.height;

		this.#width = w;
		this.#height = h;
		MZRUI.$setAttribute( this.#svg, "viewBox", `0 0 ${ w } ${ h }` );
		this.draw();
	}
	draw() {
		if ( this.firstChild ) {
			const pts = mzruiEnvelopeGraph.#getPoints(
				this.#width, this.#height, this.duration,
				this.attack, this.hold, this.decay, this.sustain, this.release );

			MZRUI.$setAttribute( this.#attLine, "points", pts.slice( 0, 8 ).join( " " ) );
			MZRUI.$setAttribute( this.#relLine, "points", pts.slice( -4 ).join( " " ) );
			MZRUI.$setAttribute( this.#mainLine, "points", pts.join( " " ) );
		}
	}
	static #getPoints( w, h, dur, att, hold, dec, sus, rel ) {
		const dur2 = dur !== "auto" ? dur : att + hold + dec + 1 + rel;
		const bpp = w / dur2;
		const attX = bpp * att;
		const holX = attX + bpp * hold;
		const decX = holX + bpp * dec;
		const susX = decX + bpp * ( dur === "auto" ? 1 : dur - att - hold - dec - rel );
		const relX = susX + bpp * rel;
		const susY = h * ( 1 - sus );

		return [
			0,    h,
			attX, 2,
			holX, 2,
			decX, susY + 2,
			susX, susY + 2,
			relX, h,
		];
	}
}

Object.freeze( mzruiEnvelopeGraph );
customElements.define( "mzrui-envelope-graph", mzruiEnvelopeGraph );
