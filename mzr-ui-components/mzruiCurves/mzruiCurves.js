"use strict";

class mzruiCurves extends HTMLElement {
	#size = Object.seal( [ 0, 0 ] );
	#curves = new Map();
	#options = Object.seal( {
		nyquist: 24000,
		nbBands: 8,
	} );
	#children = MZRUI.$getTemplate( "mzrui-curves" );
	#elements = MZRUI.$findElements( this.#children, {
		svg: "svg",
		line: ".mzruiCurves-line",
		marks: ".mzruiCurves-marks",
		curves: ".mzruiCurves-curves",
	} );

	constructor() {
		super();
		Object.freeze( this );
	}

	// .........................................................................
	connectedCallback() {
		if ( this.#children ) {
			this.append( this.#children );
			this.#children = null;
		}
	}

	// .........................................................................
	resized() {
		const bcr = this.#elements.svg.getBoundingClientRect();
		const w = bcr.width;
		const h = bcr.height;

		this.#size[ 0 ] = w;
		this.#size[ 1 ] = h;
		MZRUI.$setAttribute( this.#elements.svg, "viewBox", `0 0 ${ w } ${ h }` );
		this.redraw();
	}
	options( opt ) {
		Object.assign( this.#options, opt );
		if ( "nbBands" in opt || "nyquist" in opt ) {
			this.#updateHzTexts();
		}
	}
	setCurve( id, curve ) {
		const path = this.#elements.curves.querySelector( `[data-id="${ id }"]` );

		if ( curve ) {
			this.#curves.set( id, curve );
			if ( path ) {
				MZRUI.$setAttribute( path, "d", this.#createPathD( curve ) );
			} else {
				this.#createPath( id, curve );
			}
		} else {
			this.#curves.delete( id );
			path.remove();
		}
	}
	redraw() {
		this.#updateHzTexts();
		this.#updateLinePos();
		this.#curves.forEach( ( curve, id ) => {
			MZRUI.$setAttribute( this.#elements.curves.querySelector( `[data-id="${ id }"]` ),
				"d", this.#createPathD( curve ) );
		} );
	}
	getWidth() {
		return this.#size[ 0 ];
	}

	// .........................................................................
	#updateLinePos() {
		const [ w, h ] = this.#size;

		MZRUI.$setAttribute( this.#elements.line, {
			x1: 0,
			x2: w,
			y1: h / 2,
			y2: h / 2,
		} );
	}
	#updateHzTexts() {
		const [ w, h ] = this.#size;
		const nb = this.#options.nbBands;
		const nyquist = this.#options.nyquist;
		const rects = [];
		const marks = [];

		for ( let i = 0; i < nb; ++i ) {
			const x = i / nb * w | 0;
			const Hz = Math.round( nyquist * ( 2 ** ( i / nb * 11 - 11 ) ) );

			marks.push( MZRUI.$createElementSVG( "text", {
				class: "mzruiCurves-markText",
				x: x + 3,
				y: 14,
			}, Hz < 1000 ? Hz : `${ ( Hz / 1000 ).toFixed( 1 ) }k` ) );
			if ( i % 2 === 0 ) {
				rects.push( MZRUI.$createElementSVG( "rect", {
					class: "mzruiCurves-markBg",
					x,
					y: 0,
					width: w / nb | 0,
					height: h,
					"shape-rendering": "crispEdges",
				} ) );
			}
		}
		MZRUI.$emptyElement( this.#elements.marks );
		this.#elements.marks.append( ...rects, ...marks );
	}
	#createPath( id, curve ) {
		this.#elements.curves.append( MZRUI.$createElementSVG( "path", {
			class: "mzruiCurves-curve",
			"data-id": id,
			d: this.#createPathD( curve ),
		} ) );
	}
	#createPathD( curve ) {
		const w = this.#size[ 0 ];
		const len = curve.length;
		const d = [ `M 0 ${ this.#dbToY( curve[ 0 ] ) } ` ];

		for ( let i = 1; i < len; ++i ) {
		    d.push( `L ${ i / len * w | 0 } ${ this.#dbToY( curve[ i ] ) } ` );
		}
		return d.join( "" );
	}
	#dbToY( db ) {
		const h = this.#size[ 1 ];
		const y = 20 * Math.log( Math.max( db, .0001 ) ) / Math.LN10;

		return h / 2 - y * ( h / 100 );
	}
}

Object.freeze( mzruiCurves );
customElements.define( "mzrui-curves", mzruiCurves );
