"use strict";

class MZRPianoroll {
	#dawcore = null;
	#keysId = null;
	#patternId = null;
	rootElement = new mzruiPianoroll();
	timeline = this.rootElement.timeline;
	#dataKeys = new DAWCore.controllers.keys( {
		dataCallbacks: {
			addKey: ( id, blc ) => this.rootElement.addKey( id, blc ),
			removeKey: id => this.rootElement.removeKey( id ),
			changeKeyProp: ( id, prop, val ) => this.rootElement.changeKeyProp( id, prop, val ),
		},
	} );

	constructor() {
		Object.seal( this );

		MZRUI.$listenEvents( this.rootElement, {
			mzruiPianoroll: {
				changeKeysProps: d => {
					this.#dawcore.callAction( "changeKeysProps", this.#patternId, ...d.args );
				},
			},
			mzruiTimeline: {
				changeCurrentTime: d => {
					this.#dawcore.keysSetCurrentTime( d.args[ 0 ] );
				},
				changeLoop: d => {
					d.args[ 0 ] !== false
						? this.#dawcore.keysSetLoop( ...d.args )
						: this.#dawcore.keysClearLoop();
				},
			},
			mzruiKeys: {
				keyUp: d => { this.#dawcore.liveKeyup( d.args[ 0 ] ); },
				keyDown: d => { this.#dawcore.liveKeydown( d.args[ 0 ] ); },
			},
		} );
		this.rootElement.setData( this.#dataKeys.data );
		this.rootElement.setCallbacks( {
			onchange: this.#onchange.bind( this ),
		} );
		MZRUI.$setAttribute( this.rootElement, "disabled", true );
	}

	// .........................................................................
	setDAWCore( core ) {
		this.#dawcore = core;
	}
	selectPattern( id ) {
		if ( id !== this.#patternId ) {
			this.#patternId = id;
			this.#keysId = null;
			this.#dataKeys.clear();
			this.rootElement.reset();
			MZRUI.$setAttribute( this.rootElement, "disabled", !id );
			if ( id ) {
				const pat = this.#dawcore.$getPattern( id );
				const keys = this.#dawcore.$getKeys( pat.keys );

				this.#keysId = pat.keys;
				this.#dataKeys.change( keys );
				this.rootElement.scrollToKeys();
			}
		}
	}
	change( obj ) {
		if ( "beatsPerMeasure" in obj || "stepsPerBeat" in obj ) {
			this.rootElement.timeDivision(
				this.#dawcore.$getBeatsPerMeasure(),
				this.#dawcore.$getStepsPerBeat() );
		}
		if ( "patternKeysOpened" in obj ) {
			this.selectPattern( obj.patternKeysOpened );
		} else {
			const keys = obj.keys && obj.keys[ this.#keysId ];

			if ( keys ) {
				this.#dataKeys.change( keys );
			}
		}
	}
	clear() {
		this.selectPattern( null );
		this.#dataKeys.clear();
	}
	getUIKeys() {
		return this.rootElement.uiKeys;
	}

	// .........................................................................
	#onchange( obj, ...args ) {
		switch ( obj ) { // tmp
			case "add": this.#dawcore.callAction( "addKey", this.#patternId, ...args ); break;
			case "move": this.#dawcore.callAction( "moveKeys", this.#patternId, ...args ); break;
			case "clone": this.#dawcore.callAction( "cloneSelectedKeys", this.#patternId, ...args ); break;
			case "remove": this.#dawcore.callAction( "removeKeys", this.#patternId, ...args ); break;
			case "cropEnd": this.#dawcore.callAction( "cropEndKeys", this.#patternId, ...args ); break;
			case "redirect": this.#dawcore.callAction( "redirectKey", this.#patternId, ...args ); break;
			case "selection": this.#dawcore.callAction( "selectKeys", this.#patternId, ...args ); break;
			case "unselection": this.#dawcore.callAction( "unselectAllKeys", this.#patternId, ...args ); break;
			case "unselectionOne": this.#dawcore.callAction( "unselectKey", this.#patternId, ...args ); break;
		}
	}
}

Object.freeze( MZRPianoroll );
