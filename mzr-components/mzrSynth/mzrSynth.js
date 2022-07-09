"use strict";

class MZRSynth {
	#dawcore = null;
	#synthId = null;
	rootElement = MZRUI.$createElement( "mzrui-synthesizer" );
	#dataSynth = new DAWCore.controllers.synth( {
		dataCallbacks: {
			addOsc: ( id, osc ) => this.rootElement.addOscillator( id, osc ),
			removeOsc: id => this.rootElement.removeOscillator( id ),
			changeEnvProp: ( k, v ) => MZRUI.$setAttribute( this.rootElement.env, k, v ),
			changeLFOProp: ( k, v ) => MZRUI.$setAttribute( this.rootElement.lfo, k, v ),
			changeOscProp: ( id, k, v ) => MZRUI.$setAttribute( this.rootElement.getOscillator( id ), k, v ),
			updateEnvWave: () => this.rootElement.env.updateWave(),
			updateLFOWave: () => this.rootElement.lfo.updateWave(),
			updateOscWave: id => this.rootElement.getOscillator( id ).updateWave(),
		},
	} );

	constructor() {
		Object.seal( this );

		this.rootElement.addEventListener( "mzruiEvents", e => {
			const d = e.detail;
			const a = d.args;
			const id = this.#synthId;
			const dc = this.#dawcore;

			switch ( d.component ) {
				case "mzruiEnvelope":
					switch ( d.eventName ) {
						case "toggle": dc.callAction( "toggleEnv", id ); break;
						case "change": dc.callAction( "changeEnv", id, ...a ); break;
						// case "liveChange": dc.liveChangeSynth( id, { env: { [ a[ 0 ] ]: a[ 1 ] } } ); break;
					}
					break;
				case "mzruiLFO":
					switch ( d.eventName ) {
						case "toggle": dc.callAction( "toggleLFO", id ); break;
						case "change": dc.callAction( "changeLFO", id, ...a ); break;
						case "liveChange": dc.liveChangeSynth( id, { lfo: { [ a[ 0 ] ]: a[ 1 ] } } ); break;
					}
					break;
				case "mzruiSynthesizer":
					switch ( d.eventName ) {
						case "addOscillator": dc.callAction( "addOscillator", id ); break;
						case "reorderOscillator": dc.callAction( "reorderOscillator", id, a[ 0 ] ); break;
					}
					break;
				case "mzruiOscillator": {
					const oscId = e.target.dataset.id;

					switch ( d.eventName ) {
						case "remove": dc.callAction( "removeOscillator", id, oscId ); break;
						case "change": dc.callAction( "changeOscillator", id, oscId, ...a ); break;
						case "liveChange": dc.liveChangeSynth( id, { oscillators: { [ oscId ]: { [ a[ 0 ] ]: a[ 1 ] } } } ); break;
					}
				} break;
			}
			e.stopPropagation();
		} );
	}

	// .........................................................................
	loadWaves() {
		return new Promise( resolve => {
			const wavesJS = MZRUI.$createElement( "script", { type: "text/javascript", src: "/assets/mzrwaPeriodicWavesList-v1.js" } );

			wavesJS.onload = () => {
				const waves = mzrwaPeriodicWaves.loadWaves( mzrwaPeriodicWavesList );

				this.rootElement.setWaveList( Array.from( waves.keys() ) );
				waves.forEach( ( w, name ) => mzruiPeriodicWave.addWave( name, w.real, w.imag ) );
				resolve();
			};
			document.head.append( wavesJS );
		} );
	}
	setDAWCore( core ) {
		this.#dawcore = core;
	}
	selectSynth( id ) {
		if ( id !== this.#synthId ) {
			this.#synthId = id;
			this.#dataSynth.clear();
			if ( id ) {
				this.#dataSynth.change( this.#dawcore.$getSynth( id ) );
			}
		}
	}
	change( obj ) {
		const daw = this.#dawcore;
		const synObj = obj.synths && obj.synths[ this.#synthId ];

		if ( "beatsPerMeasure" in obj || "stepsPerBeat" in obj ) {
			MZRUI.$setAttribute( this.rootElement.env, "timedivision", `${ daw.$getBeatsPerMeasure() }/${ daw.$getStepsPerBeat() }` );
			MZRUI.$setAttribute( this.rootElement.lfo, "timedivision", `${ daw.$getBeatsPerMeasure() }/${ daw.$getStepsPerBeat() }` );
		}
		if ( synObj ) {
			this.#dataSynth.change( synObj );
			if ( synObj.oscillators ) {
				this.rootElement.reorderOscillators( synObj.oscillators );
			}
		}
		if ( "synthOpened" in obj ) {
			this.selectSynth( obj.synthOpened );
		}
	}
	clear() {
		this.#dataSynth.clear();
	}
}

Object.freeze( MZRSynth );
