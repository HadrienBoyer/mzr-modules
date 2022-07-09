"use strict";

class mzruiEnvelope extends HTMLElement {
	#dur = 4;
	#waveWidth = 300;
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiEnvelope" );
	#onresizeBind = this.#onresize.bind( this );
	#children = MZRUI.$getTemplate( "mzrui-envelope" );
	#elements = MZRUI.$findElements( this.#children, {
		beatlines: "mzrui-beatlines",
		graph: "mzrui-envelope-graph",
		sliders: {
			attack:  [ ".mzruiEnvelope-attack  mzrui-slider", ".mzruiEnvelope-attack  .mzruiEnvelope-propValue" ],
			hold:    [ ".mzruiEnvelope-hold    mzrui-slider", ".mzruiEnvelope-hold    .mzruiEnvelope-propValue" ],
			decay:   [ ".mzruiEnvelope-decay   mzrui-slider", ".mzruiEnvelope-decay   .mzruiEnvelope-propValue" ],
			sustain: [ ".mzruiEnvelope-sustain mzrui-slider", ".mzruiEnvelope-sustain .mzruiEnvelope-propValue" ],
			release: [ ".mzruiEnvelope-release mzrui-slider", ".mzruiEnvelope-release .mzruiEnvelope-propValue" ],
		},
	} );

	constructor() {
		super();
		Object.seal( this );

		this.onchange = this.#onchangeForm.bind( this );
		MZRUI.$listenEvents( this, {
			mzruiSlider: {
				inputStart: MZRUI.$noop,
				inputEnd: MZRUI.$noop,
				input: ( d, sli ) => {
					this.#oninputSlider( sli.dataset.prop, d.args[ 0 ] );
				},
				change: ( d, sli ) => {
					this.#onchangeSlider( sli.dataset.prop, d.args[ 0 ] );
				},
			},
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( this.#children ) {
			this.append( ...this.#children );
			this.#children = null;
			MZRUI.$recallAttributes( this, {
				toggle: false,
				timedivision: "4/4",
				attack: .1,
				hold: .1,
				decay: .1,
				sustain: .8,
				release: 1,
			} );
			this.updateWave();
		}
		MZRUI.$observeSizeOf( this, this.#onresizeBind );
	}
	disconnectedCallback() {
		MZRUI.$unobserveSizeOf( this, this.#onresizeBind );
	}
	static get observedAttributes() {
		return [ "toggle", "attack", "hold", "decay", "sustain", "release" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "toggle": this.#changeToggle( val !== null ); break;
				case "timedivision": this.#changeTimedivision( val ); break;
				case "attack":
				case "hold":
				case "decay":
				case "sustain":
				case "release":
					this.#changeProp( prop, +val );
					break;
			}
		}
	}

	// .........................................................................
	updateWave( prop, val ) {
		const g = this.#elements.graph;

		g.attack = prop === "attack" ? val : MZRUI.$getAttributeNum( this, "attack" );
		g.hold = prop === "hold" ? val : MZRUI.$getAttributeNum( this, "hold" );
		g.decay = prop === "decay" ? val : MZRUI.$getAttributeNum( this, "decay" );
		g.sustain = prop === "sustain" ? val : MZRUI.$getAttributeNum( this, "sustain" );
		g.release = prop === "release" ? val : MZRUI.$getAttributeNum( this, "release" );
		g.duration =
		this.#dur = Math.max( g.attack + g.hold + g.decay + .5 + g.release, 2 );
		g.draw();
		this.#updatePxPerBeat();
	}

	// .........................................................................
	#changeToggle( b ) {
		MZRUI.$setAttribute( this.#elements.sliders.attack[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.hold[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.decay[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.sustain[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.release[ 0 ], "disabled", !b );
	}
	#changeTimedivision( val ) {
		MZRUI.$setAttribute( this.#elements.beatlines, "timedivision", val );
		this.updateWave();
	}
	#changeProp( prop, val ) {
		const [ sli, span ] = this.#elements.sliders[ prop ];

		sli.setValue( val );
		span.textContent = val.toFixed( 2 );
	}
	#updatePxPerBeat() {
		MZRUI.$setAttribute( this.#elements.beatlines, "pxperbeat", this.#waveWidth / this.#dur );
	}

	// .........................................................................
	#onresize() {
		this.#waveWidth = this.#elements.beatlines.getBoundingClientRect().width;
		this.#updatePxPerBeat();
		this.#elements.graph.resized();
	}
	#onchangeForm( e ) {
		switch ( e.target.name ) {
			case "mzruiEnvelope-toggle":
				MZRUI.$setAttribute( this, "toggle", !MZRUI.$hasAttribute( this, "toggle" ) );
				this.#dispatch( "toggle" );
				break;
		}
	}
	#oninputSlider( prop, val ) {
		this.#elements.sliders[ prop ][ 1 ].textContent = val.toFixed( 2 );
		this.updateWave( prop, val );
		this.#dispatch( "liveChange", prop, val );
	}
	#onchangeSlider( prop, val ) {
		MZRUI.$setAttribute( this, prop, val );
		this.#dispatch( "change", prop, val );
	}
}

Object.freeze( mzruiEnvelope );
customElements.define( "mzrui-envelope", mzruiEnvelope );
