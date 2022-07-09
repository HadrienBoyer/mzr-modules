"use strict";

class mzruiChannel extends HTMLElement {
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiChannel" );
	#children = MZRUI.$getTemplate( "mzrui-channel" );
	#elements = MZRUI.$findElements( this.#children, {
		name: ".mzruiChannel-name",
		analyser: "mzrui-analyser",
		pan: ".mzruiChannel-pan mzrui-slider",
		gain: ".mzruiChannel-gain mzrui-slider",
		connecta: ".mzruiChannel-connectA",
		connectb: ".mzruiChannel-connectB",
	} );
	analyser = this.#elements.analyser;

	constructor() {
		super();
		Object.seal( this );

		MZRUI.$listenEvents( this, {
			mzruiSlider: {
				inputStart: MZRUI.$noop,
				inputEnd: MZRUI.$noop,
				input: ( d, sli ) => {
					this.#dispatch( "liveChange", sli.dataset.prop, d.args[ 0 ] );
				},
				change: ( d, sli ) => {
					this.#dispatch( "change", sli.dataset.prop, d.args[ 0 ] );
				},
			},
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( ...this.#children );
			this.#children = null;
			MZRUI.$setAttribute( this, "draggable", "true" );
			MZRUI.$recallAttributes( this, {
				name: "chan",
				pan: 0,
				gain: 1,
				connecta: "down",
			} );
		}
	}
	static get observedAttributes() {
		return [ "name", "pan", "gain", "connecta", "connectb" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( !this.#children && prev !== val ) {
			switch ( prop ) {
				case "name":
					this.#elements.name.textContent = val;
					break;
				case "pan":
				case "gain":
					this.#elements[ prop ].setValue( val );
					break;
				case "connecta":
				case "connectb":
					this.#elements[ prop ].dataset.icon = val ? `caret-${ val }` : "";
					break;
			}
		}
	}
}

Object.freeze( mzruiChannel );
customElements.define( "mzrui-channel", mzruiChannel );
