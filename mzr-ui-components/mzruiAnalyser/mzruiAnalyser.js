"use strict";

class mzruiAnalyser extends HTMLElement {
	#cnv = MZRUI.$createElement( "canvas" );
	#ctx = this.#cnv.getContext( "2d" );

	constructor() {
		super();
		Object.seal( this );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( this.#cnv );
		}
	}

	// .........................................................................
	clear() {
		this.#ctx.clearRect( 0, 0, this.#cnv.width, this.#cnv.height );
	}
	setResolution( w, h ) {
		const img = this.#ctx.getImageData( 0, 0, this.#cnv.width, this.#cnv.height );

		this.#cnv.width = w;
		this.#cnv.height = h;
		this.#ctx.putImageData( img, 0, 0 );
	}
	draw( ldata, rdata ) {
		mzruiAnalyser.#moveImage( this.#ctx );
		mzruiAnalyser.#draw( this.#ctx, ldata, rdata );
	}

	// .........................................................................
	static #moveImage( ctx ) {
		ctx.putImageData( ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height - 1 ), 0, 1 );
	}
	static #draw( ctx, ldata, rdata ) {
		const w2 = ctx.canvas.width / 2;
		const len = Math.min( w2, ldata.length );
		const imgL = mzruiSpectrum.draw( ctx, ldata, w2 );
		const imgR = mzruiSpectrum.draw( ctx, rdata, w2 );
		const imgLflip = ctx.createImageData( len, 1 );

		for ( let x = 0, x2 = len - 1; x < len; ++x, --x2 ) {
			mzruiAnalyser.#drawPx( imgLflip.data, imgL.data, x * 4, x2 * 4 );
		}
		ctx.putImageData( imgLflip, 0, 0 );
		ctx.putImageData( imgR, w2, 0 );
	}
	static #drawPx( imgLflip, imgL, x, x2 ) {
		imgLflip[ x     ] = imgL[ x2     ];
		imgLflip[ x + 1 ] = imgL[ x2 + 1 ];
		imgLflip[ x + 2 ] = imgL[ x2 + 2 ];
		imgLflip[ x + 3 ] = imgL[ x2 + 3 ];
	}
}

Object.freeze( mzruiAnalyser );
customElements.define( "mzrui-analyser", mzruiAnalyser );
