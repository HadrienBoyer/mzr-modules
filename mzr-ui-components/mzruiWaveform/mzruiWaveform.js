"use strict";

class mzruiWaveform {
	constructor( el ) {
		const svg = el || MZRUI.$createElementSVG( "svg" );
		const poly = svg.querySelector( "polygon" );

		this.rootElement = svg;
		this.polygon = poly;
		this.width =
		this.height = 0;
		Object.seal( this );

		MZRUI.$setAttribute( svg, "preserveAspectRatio", "none" );
		svg.classList.add( "mzruiWaveform" );
		if ( !poly ) {
			this.polygon = MZRUI.$createElementSVG( "polygon" );
			svg.append( this.polygon );
		}
	}

	remove() {
		this.empty();
		this.rootElement.remove();
	}
	empty() {
		this.polygon.removeAttribute( "points" );
	}
	setResolution( w, h ) {
		this.width = w;
		this.height = h;
		MZRUI.$setAttribute( this.rootElement, "viewBox", `0 0 ${ w } ${ h }` );
	}
	drawBuffer( buf, offset, duration ) {
		mzruiWaveform.drawBuffer( this.polygon, this.width, this.height, buf, offset, duration );
	}
}
