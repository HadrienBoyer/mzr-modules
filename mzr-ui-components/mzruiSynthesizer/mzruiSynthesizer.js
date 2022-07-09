"use strict";

class mzruiSynthesizer extends HTMLElement {
	#waveList = [];
	#uiOscs = new Map();
	#children = MZRUI.$getTemplate( "mzrui-synthesizer" );
	#elements = MZRUI.$findElements( this.#children, {
		env: "mzrui-envelope",
		lfo: "mzrui-lfo",
		oscList: ".mzruiSynthesizer-oscList",
		newOsc: ".mzruiSynthesizer-newOsc",
	} );

	constructor() {
		super();
		this.env = this.#elements.env;
		this.lfo = this.#elements.lfo;
		Object.seal( this );

		this.#elements.newOsc.onclick = this.#onclickNewOsc.bind( this );
		new mzruiReorder( {
			rootElement: this.#elements.oscList,
			direction: "column",
			dataTransferType: "oscillator",
			itemSelector: "mzrui-oscillator",
			handleSelector: ".mzruiOscillator-grip",
			parentSelector: ".mzruiSynthesizer-oscList",
			onchange: this.#onchangeReorder.bind( this ),
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( ...this.#children );
			this.#children = null;
		}
	}

	// .........................................................................
	setWaveList( arr ) {
		this.#waveList = arr;
		this.#uiOscs.forEach( o => o.addWaves( arr ) );
	}
	getOscillator( id ) {
		return this.#uiOscs.get( id );
	}

	// .........................................................................
	addOscillator( id ) {
		const uiOsc = MZRUI.$createElement( "mzrui-oscillator", { "data-id": id } );

		this.#uiOscs.set( id, uiOsc );
		uiOsc.addWaves( this.#waveList );
		this.#elements.oscList.append( uiOsc );
	}
	removeOscillator( id ) {
		const osc = this.#uiOscs.get( id );

		if ( osc ) {
			osc.remove();
			this.#uiOscs.delete( id );
		}
	}
	reorderOscillators( obj ) {
		mzruiReorder.listReorder( this.#elements.oscList, obj );
	}

	// .........................................................................
	#onclickNewOsc() {
		MZRUI.$dispatchEvent( this, "mzruiSynthesizer", "addOscillator" );
	}
	#onchangeReorder() {
		const oscs = mzruiReorder.listComputeOrderChange( this.#elements.oscList, {} );

		MZRUI.$dispatchEvent( this, "mzruiSynthesizer", "reorderOscillator", oscs );
	}
}

Object.freeze( mzruiSynthesizer );
customElements.define( "mzrui-synthesizer", mzruiSynthesizer );
