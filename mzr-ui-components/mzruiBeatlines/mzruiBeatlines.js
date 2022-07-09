"use strict";

class mzruiBeatlines extends HTMLElement {
	static get observedAttributes() {
		return [ "vertical", "timedivision", "pxperbeat", "coloredbeats" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "vertical":
				case "timedivision":
				case "coloredbeats":
					this.style.backgroundImage = mzruiBeatlines.#background(
						this.hasAttribute( "vertical" ) ? 180 : 90,
						...( MZRUI.$getAttribute( this, "timedivision" ) || "4/4" ).split( "/" ),
						this.hasAttribute( "coloredbeats" ) );
					break;
				case "pxperbeat":
					this.style.fontSize = `${ val }px`;
					this.style.opacity = Math.min( val / 48, 1 );
					break;
			}
		}
	}

	// .........................................................................
	static #background( deg, bPM, sPB, colored ) {
		return (
			mzruiBeatlines.#repeat( deg, ".5px", "rgba(0,0,0,.15)", 1 / sPB, "," ) +
			mzruiBeatlines.#repeat( deg, ".5px", "rgba(0,0,0,.25)", 1, "," ) +
			mzruiBeatlines.#repeat( deg, "1px", "rgba(0,0,0,.5)", bPM, "" ) +
			( colored
				? `,repeating-linear-gradient(${ deg }deg, rgba(0,0,0,.08), rgba(0,0,0,.08) 1em, transparent 1em, transparent 2em)`
				: "" )
		);
	}
	static #repeat( deg, w, col, em, sep ) {
		return `repeating-linear-gradient(${ deg }deg, ${ col }, ${ col } ${ w }, transparent ${ w }, transparent calc(${ em }em - ${ w }), ${ col } calc(${ em }em - ${ w }), ${ col } ${ em }em)${ sep }`;
	}
}

Object.freeze( mzruiBeatlines );
customElements.define( "mzrui-beatlines", mzruiBeatlines );
