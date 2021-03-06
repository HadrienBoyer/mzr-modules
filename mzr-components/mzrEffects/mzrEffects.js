"use strict";

class MZREffects {
	#dawcore = null;
	#destFilter = "main";
	rootElement = new mzruiEffects();
	#ctrlEffects = new DAWCore.controllers.effects( {
		dataCallbacks: {
			addEffect: ( id, obj ) => this.rootElement.addEffect( id, obj ),
			removeEffect: id => this.rootElement.removeEffect( id ),
			changeEffect: ( id, prop, val ) => this.rootElement.changeEffect( id, prop, val ),
			changeEffectData: ( id, obj ) => this.#changeEffectData( id, obj ),
		},
	} );

	constructor() {
		Object.seal( this );

		this.rootElement.askData = ( fxId, fxType, dataType, ...args ) => {
			if ( fxType === "filter" && dataType === "curve" ) {
				return this.#dawcore.$getAudioEffect( fxId )?.updateResponse?.( args[ 0 ] );
			}
		};
		MZRUI.$listenEvents( this.rootElement, {
			mzruiEffects: {
				liveChangeEffect: d => {
					this.#dawcore.liveChangeEffect( ...d.args );
				},
				addEffect: d => {
					d.args.unshift( this.#destFilter );
					this.#dawcore.callAction( "addEffect", ...d.args );
				},
				default: d => {
					this.#dawcore.callAction( d.eventName, ...d.args );
				},
			},
		} );
	}

	// .........................................................................
	setDAWCore( core ) {
		this.#dawcore = core;
	}
	getDestFilter() {
		return this.#destFilter;
	}
	setDestFilter( dest ) {
		this.#destFilter = dest;
		this.#ctrlEffects.setDestFilter( dest );
	}
	change( obj ) {
		this.#ctrlEffects.change( obj );
		if ( obj.effects ) {
			this.rootElement.reorderEffects( obj.effects );
		}
	}
	clear() {
		this.#ctrlEffects.clear();
	}

	// .........................................................................
	#changeEffectData( id, obj ) {
		const uiFx = this.rootElement.getFxHTML( id ).uiFx;

		Object.entries( obj ).forEach( kv => MZRUI.$setAttribute( uiFx, ...kv ) );
		if ( uiFx.updateWave ) {
			uiFx.updateWave();
		}
	}
}

Object.freeze( MZREffects );
