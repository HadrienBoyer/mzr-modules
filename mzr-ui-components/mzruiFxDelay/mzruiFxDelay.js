"use strict";

class mzruiFxDelay {
	constructor() {
		const root = mzruiFxDelay.template.cloneNode( true );
		const elEchoes = root.querySelector( ".mzruiFxDelay-echoes" );
		const elLinkBtn = root.querySelector( ".mzruiFxDelay-echoesLink" );
		const uiSliderZoom = new mzruiSlider();
		const uiDotline = new mzruiDotline();
		const blines = new mzruiBeatlines( elEchoes );
		const gsdata = new GSDataFxDelay( {
			actionCallback: ( obj, msg ) => this.onchange( obj, msg ),
			dataCallbacks: {
				changeEchoes: uiDotline.change.bind( uiDotline ),
			},
		} );

		this.rootElement = root;
		this.gsdata = gsdata;
		this.oninput =
		this.onchange = MZRUI.$noop;
		this._uiSliderZoom = uiSliderZoom;
		this._uiDotline = uiDotline;
		this._elLinkBtn = elLinkBtn;
		this._blines = blines;
		this._blinesW = 0;
		Object.seal( this );

		elEchoes.prepend( uiDotline.rootElement, uiSliderZoom.rootElement );
		uiDotline.options( {
			x: "delay",
			y: "pan",
			minX: 0, maxX: 8,
			minY: -1, maxY: 1,
			step: 1 / 8,
			moveMode: "free",
			firstDotLinked: 0,
		} );
		this._setLinkBtn( "free" );
		uiSliderZoom.options( { type: "linear-x", min: 1, max: 8, step: 1 / 8 } );
		blines.render();
		elLinkBtn.onclick = this._onclickLinkBtn.bind( this );
		uiSliderZoom.oninput =
		uiSliderZoom.onchange = this.zoom.bind( this );
		uiDotline.onchange = echoes => this.gsdata.callAction( "changeEchoes", echoes );
		uiDotline.oninput = ( id, delay, pan ) => this.oninput( "echoes", id, delay, pan );
	}

	attached() {
		this._uiDotline.attached();
		this._uiSliderZoom.attached();
		this.resized();
		this.zoom( 4 );
	}
	resized() {
		this._blinesW = this._blines.rootElement.getBoundingClientRect().width;
		this._uiDotline.resize();
		this.zoom( this._uiSliderZoom.value );
	}
	timeSignature( a, b ) {
		this._blines.timeSignature( a, b );
	}
	zoom( beats ) {
		this._uiSliderZoom.setValue( beats );
		this._blines.pxPerBeat( this._blinesW / beats );
		this._blines.render();
		this._uiDotline.options( { maxX: beats } );
	}

	// .........................................................................
	_setLinkBtn( moveMode ) {
		this._elLinkBtn.dataset.icon = moveMode === "linked" ? "link" : "unlink";
	}

	// events
	// .........................................................................
	_onclickLinkBtn() {
		const moveMode = this._uiDotline.options().moveMode === "free" ? "linked" : "free";

		this._setLinkBtn( moveMode );
		this._uiDotline.options( { moveMode } );
	}
}

mzruiFxDelay.template = document.querySelector( "#mzruiFxDelay" );
mzruiFxDelay.template.remove();
mzruiFxDelay.template.removeAttribute( "id" );

if ( typeof mzruiEffects !== "undefined" ) {
	mzruiEffects.fxsMap.set( "delay", { cmp: mzruiFxDelay, name: "Delay", height: 120 } );
}
