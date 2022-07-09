"use strict";

class mzruiFxFilter extends HTMLElement {
	#nyquist = 24000;
	#attached = false;
	#currType = "lowpass";
	#onresizeBind = this.#onresize.bind( this );
	#fnValue = {
		Q: a => a,
		gain: a => a,
		detune: a => a,
		frequency: a => this.#nyquist * ( 2 ** ( a * 11 - 11 ) ),
	};
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiFxFilter" );
	#children = MZRUI.$getTemplate( "mzrui-fx-filter" );
	#elements = MZRUI.$findElements( this.#children, {
		type: ".mzruiFxFilter-areaType .mzruiFxFilter-area-content",
		graph: ".mzruiFxFilter-areaGraph .mzruiFxFilter-area-content",
		curves: "mzrui-curves",
		sliders: {
			Q: ".mzruiFxFilter-areaQ mzrui-slider",
			gain: ".mzruiFxFilter-areaGain mzrui-slider",
			detune: ".mzruiFxFilter-areaDetune mzrui-slider",
			frequency: ".mzruiFxFilter-areaFrequency mzrui-slider",
		},
	} );
	static typeGainQ = Object.freeze( {
		lowpass:   Object.freeze( { gain: false, q: true } ),
		highpass:  Object.freeze( { gain: false, q: true } ),
		bandpass:  Object.freeze( { gain: false, q: true } ),
		lowshelf:  Object.freeze( { gain: true,  q: false } ),
		highshelf: Object.freeze( { gain: true,  q: false } ),
		peaking:   Object.freeze( { gain: true,  q: true } ),
		notch:     Object.freeze( { gain: false, q: true } ),
		allpass:   Object.freeze( { gain: false, q: true } ),
	} );

	constructor() {
		super();
		this.askData = MZRUI.$noop;
		Object.seal( this );

		this.#elements.type.onclick = this.#onclickType.bind( this );
		MZRUI.$listenEvents( this, {
			mzruiSlider: {
				inputStart: MZRUI.$noop,
				inputEnd: MZRUI.$noop,
				input: ( d, sli ) => {
					this.#oninputProp( sli.dataset.prop, this.#fnValue[ sli.dataset.prop ]( d.args[ 0 ] ) );
				},
				change: ( d, sli ) => {
					this.#dispatch( "changeProp", sli.dataset.prop, this.#fnValue[ sli.dataset.prop ]( d.args[ 0 ] ) );
				},
			},
		} );
		this.#elements.graph.append( this.#elements.curves );
	}

	// .........................................................................
	connectedCallback() {
		this.#attached = true;
		if ( this.#children ) {
			this.append( ...this.#children );
			this.#children = null;
			this.#onresize();
			this.updateWave();
		}
		MZRUI.$observeSizeOf( this, this.#onresizeBind );
	}
	disconnectedCallback() {
		this.#attached = false;
		MZRUI.$unobserveSizeOf( this, this.#onresizeBind );
	}
	static get observedAttributes() {
		return [ "type", "frequency", "q", "gain", "detune" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "type": {
					const gainQ = mzruiFxFilter.typeGainQ[ val ];

					this.#toggleTypeBtn( this.#currType, false );
					this.#toggleTypeBtn( val, true );
					this.#currType = val;
					MZRUI.$setAttribute( this.#elements.sliders.Q, "disabled", !gainQ.q );
					MZRUI.$setAttribute( this.#elements.sliders.gain, "disabled", !gainQ.gain );
				} break;
				case "q":
					this.#elements.sliders.Q.setValue( +val );
					break;
				case "gain":
				case "detune":
					this.#elements.sliders[ prop ].setValue( +val );
					break;
				case "frequency":
					this.#elements.sliders.frequency.setValue( ( Math.log2( val / this.#nyquist ) + 11 ) / 11 );
					break;
			}
		}
	}

	// .........................................................................
	setNyquist( n ) {
		this.#nyquist = n;
	}
	toggle( b ) {
		this.classList.toggle( "mzruiFxFilter-enable", b );
		setTimeout( () => this.updateWave(), 150 );
	}
	updateWave() {
		if ( this.#attached ) {
			const curve = this.askData( "curve", this.#elements.curves.getWidth() );

			if ( curve ) {
				this.#elements.curves.setCurve( "0", curve );
			}
		}
	}

	// .........................................................................
	#toggleTypeBtn( type, b ) {
		this.#elements.type.querySelector( `[data-type="${ type }"]` )
			.classList.toggle( "mzruiFxFilter-areaType-btnSelected", b );
	}

	// .........................................................................
	#onresize() {
		this.#elements.curves.resized();
	}
	#oninputProp( prop, val ) {
		this.#dispatch( "liveChange", prop, val );
		this.updateWave();
	}
	#onclickType( e ) {
		const type = e.target.dataset.type;

		if ( type && !e.target.classList.contains( "mzruiFxFilter-areaType-btnSelected" ) ) {
			this.#dispatch( "changeProp", "type", type );
		}
	}
}

Object.freeze( mzruiFxFilter );
customElements.define( "mzrui-fx-filter", mzruiFxFilter );

if ( typeof mzruiEffects !== "undefined" ) {
	mzruiEffects.fxsMap.set( "filter", { cmp: mzruiFxFilter, name: "Filter", height: 160 } );
}
