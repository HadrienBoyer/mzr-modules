"use strict";

class mzruiLFO extends HTMLElement {
	#dur = 4;
	#waveWidth = 300;
	#nyquist = 24000;
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiLFO" );
	#onresizeBind = this.#onresize.bind( this );
	#children = MZRUI.$getTemplate( "mzrui-lfo" );
	#elements = MZRUI.$findElements( this.#children, {
		title: ".mzruiLFO-title",
		beatlines: "mzrui-beatlines",
		wave: "mzrui-periodicwave",
		sliders: {
			delay:       [ ".mzruiLFO-delay       mzrui-slider", ".mzruiLFO-delay       .mzruiLFO-propValue" ],
			attack:      [ ".mzruiLFO-attack      mzrui-slider", ".mzruiLFO-attack      .mzruiLFO-propValue" ],
			speed:       [ ".mzruiLFO-speed       mzrui-slider", ".mzruiLFO-speed       .mzruiLFO-propValue" ],
			amp:         [ ".mzruiLFO-amp         mzrui-slider", ".mzruiLFO-amp         .mzruiLFO-propValue" ],
			lowpassfreq: [ ".mzruiLFO-lowpassfreq mzrui-slider", ".mzruiLFO-lowpassfreq .mzruiLFO-propValue" ],
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
				target: "gain",
				toggle: false,
				timedivision: "4/4",
				type: "sine",
				delay: 0,
				attack: 1,
				speed: 1,
				amp: 1,
			} );
			this.updateWave();
		}
		MZRUI.$observeSizeOf( this, this.#onresizeBind );
	}
	disconnectedCallback() {
		MZRUI.$unobserveSizeOf( this, this.#onresizeBind );
	}
	static get observedAttributes() {
		return [ "target", "toggle", "timedivision", "type", "delay", "attack", "speed", "amp", "lowpassfreq" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( !this.#children && prev !== val ) {
			const num = +val;

			switch ( prop ) {
				case "target": this.#changeTarget( val ); break;
				case "timedivision": MZRUI.$setAttribute( this.#elements.beatlines, "timedivision", val ); break;
				case "toggle": this.#changeToggle( val !== null ); break;
				case "type": this.#changeType( val ); break;
				case "delay":
				case "attack":
				case "speed":
				case "lowpassfreq":
					this.#changeProp( prop, num );
					break;
				case "amp":
					if ( num > 0 !== prev > 0 ) {
						this.#changeAmpSign( num );
					}
					this.#changeProp( "amp", Math.abs( num ) );
					break;
			}
		}
	}

	// .........................................................................
	updateWave( prop, val ) {
		const w = this.#elements.wave;
		const bPM = +MZRUI.$getAttribute( this, "timedivision" ).split( "/" )[ 0 ];

		w.type = MZRUI.$getAttribute( this, "type" );
		w.delay = prop === "delay" ? val : MZRUI.$getAttributeNum( this, "delay" );
		w.attack = prop === "attack" ? val : MZRUI.$getAttributeNum( this, "attack" );
		w.frequency = prop === "speed" ? val : MZRUI.$getAttributeNum( this, "speed" );
		w.amplitude = prop === "amp" ? val : MZRUI.$getAttributeNum( this, "amp" );
		w.duration =
		this.#dur = Math.max( w.delay + w.attack + 2, bPM );
		w.draw();
		w.style.opacity = Math.min( 6 / w.frequency, 1 );
		this.#updatePxPerBeat();
	}

	// .........................................................................
	#changeTarget( t ) {
		this.#elements.title.textContent = `LFO ${ t }`;
		this.#onresize();
	}
	#changeToggle( b ) {
		this.querySelectorAll( ".mzruiLFO-typeRadio" ).forEach( el => MZRUI.$setAttribute( el, "disabled", !b ) );
		MZRUI.$setAttribute( this.#elements.sliders.delay[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.attack[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.speed[ 0 ], "disabled", !b );
		MZRUI.$setAttribute( this.#elements.sliders.amp[ 0 ], "disabled", !b );
	}
	#changeType( type ) {
		this.#elements.wave.type = type;
		this.querySelector( `.mzruiLFO-typeRadio[value="${ type }"]` ).checked = true;
	}
	#changeAmpSign( amp ) {
		this.querySelector( `.mzruiLFO-ampSignRadio[value="${ Math.sign( amp ) || 1 }"]` ).checked = true;
	}
	#changeProp( prop, val ) {
		const sli = this.#elements.sliders[ prop ];

		if ( sli ) {
			sli[ 0 ].setValue( val );
			sli[ 1 ].textContent = mzruiLFO.#formatVal( prop, val );
		}
	}
	#updatePxPerBeat() {
		MZRUI.$setAttribute( this.#elements.beatlines, "pxPerBeat", this.#waveWidth / this.#dur );
	}
	static #formatVal( prop, val ) {
		return val.toFixed( 2 );
		// return prop === "lowpassfreq" ? val : val.toFixed( 2 );
	}

	// .........................................................................
	#onresize() {
		this.#waveWidth = this.#elements.beatlines.getBoundingClientRect().width;
		this.#updatePxPerBeat();
		this.#elements.wave.resized();
	}
	#onchangeForm( e ) {
		switch ( e.target.name ) {
			case "mzruiLFO-toggle":
				MZRUI.$setAttribute( this, "toggle", !MZRUI.$hasAttribute( this, "toggle" ) );
				this.#dispatch( "toggle" );
				break;
			case "mzruiLFO-type":
				MZRUI.$setAttribute( this, "type", e.target.value );
				this.updateWave();
				this.#dispatch( "change", "type", e.target.value );
				break;
			case "mzruiLFO-ampSign":
				MZRUI.$setAttribute( this, "amp", -MZRUI.$getAttributeNum( this, "amp" ) );
				this.updateWave();
				this.#dispatch( "change", "amp", MZRUI.$getAttributeNum( this, "amp" ) );
				break;
		}
	}
	#oninputSlider( prop, val ) {
		const realval = prop !== "amp"
			? val
			: val * Math.sign( MZRUI.$getAttributeNum( this, "amp" ) );

		this.#elements.sliders[ prop ][ 1 ].textContent = mzruiLFO.#formatVal( prop, val );
		this.updateWave( prop, realval );
		this.#dispatch( "liveChange", prop, realval );
	}
	#onchangeSlider( prop, val ) {
		const nval = prop === "amp"
			? val * Math.sign( MZRUI.$getAttributeNum( this, "amp" ) )
			: val;

		MZRUI.$setAttribute( this, prop, nval );
		this.#dispatch( "change", prop, nval );
	}
}

Object.freeze( mzruiLFO );
customElements.define( "mzrui-lfo", mzruiLFO );
