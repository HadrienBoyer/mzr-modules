"use strict";

class mzruiPatterns extends HTMLElement {
	#fnsPattern = Object.freeze( {
		clone: id => this.onchange( "clonePattern", id ),
		remove: id => this.onchange( "removePattern", id ),
		editInfo: ( id, el ) => this.#openInfoPopup( id, el ),
		undefined: id => this.onchange( "openPattern", id ),
		redirect: ( id, el, e ) => this.#openChannelsPopup( "redirectPatternBuffer", id, e.target.dataset.id ),
	} );
	#fnsSynth = Object.freeze( {
		expand: id => this.expandSynth( id ),
		undefined: id => this.onchange( "openSynth", id ),
		redirect: ( id, e ) => this.#openChannelsPopup( "redirectSynth", id, e.target.dataset.id ),
		newPattern: id => {
			this.onchange( "addPatternKeys", id );
			this.expandSynth( id, true );
		},
		delete: id => {
			this.#elements.lists.synth.children.length > 1
				? this.onchange( "removeSynth", id )
				: MZRUI.$popup.alert( "Error", "You have to keep at least one synthesizer" );
		},
	} );
	#children = MZRUI.$getTemplate( "mzrui-patterns" );
	#elements = MZRUI.$findElements( this.#children, {
		lists: {
			slices: ".mzruiPatterns-panelSlices .mzruiPatterns-panel-list",
			drums: ".mzruiPatterns-panelDrums .mzruiPatterns-panel-list",
			synth: ".mzruiPatterns-panelKeys .mzruiPatterns-panel-list",
			buffer: ".mzruiPatterns-panelBuffers .mzruiPatterns-panel-list",
		},
		newSlices: "[data-action='newSlices']",
		newDrums: "[data-action='newDrums']",
		newSynth: "[data-action='newSynth']",
	} );
	#nlKeysLists = this.#elements.lists.synth.getElementsByClassName( "mzruiPatterns-synth-patterns" );
	static infoPopupContent = MZRUI.$getTemplate( "mzrui-patterns-infoPopup" );

	constructor() {
		super();
		this.onchange =
		this.onpatternDataTransfer = null;
		Object.seal( this );

		new mzruiReorder( {
			rootElement: this.#elements.lists.buffer,
			direction: "column",
			dataTransfer: ( ...args ) => this.onpatternDataTransfer( ...args ),
			dataTransferType: "pattern-buffer",
			itemSelector: ".mzruiPatterns-pattern",
			handleSelector: ".mzruiPatterns-pattern-grip",
			parentSelector: ".mzruiPatterns-panel-list",
			onchange: this.#onreorderPatterns.bind( this, this.#elements.lists.buffer ),
		} );
		new mzruiReorder( {
			rootElement: this.#elements.lists.slices,
			direction: "column",
			dataTransfer: ( ...args ) => this.onpatternDataTransfer( ...args ),
			dataTransferType: "pattern-slices",
			itemSelector: ".mzruiPatterns-pattern",
			handleSelector: ".mzruiPatterns-pattern-grip",
			parentSelector: ".mzruiPatterns-panel-list",
			onchange: this.#onreorderPatterns.bind( this, this.#elements.lists.slices ),
		} );
		new mzruiReorder( {
			rootElement: this.#elements.lists.drums,
			direction: "column",
			dataTransfer: ( ...args ) => this.onpatternDataTransfer( ...args ),
			dataTransferType: "pattern-drums",
			itemSelector: ".mzruiPatterns-pattern",
			handleSelector: ".mzruiPatterns-pattern-grip",
			parentSelector: ".mzruiPatterns-panel-list",
			onchange: this.#onreorderPatterns.bind( this, this.#elements.lists.drums ),
		} );
		new mzruiReorder( {
			rootElement: this.#elements.lists.synth,
			direction: "column",
			dataTransfer: ( ...args ) => this.onpatternDataTransfer( ...args ),
			dataTransferType: "pattern-keys",
			itemSelector: ".mzruiPatterns-pattern",
			handleSelector: ".mzruiPatterns-pattern-grip",
			parentSelector: ".mzruiPatterns-synth-patterns",
			onchange: this.#onreorderPatternsKeys.bind( this ),
		} );
		this.#elements.lists.synth.ondragover = e => {
			const syn = e.target.closest( ".mzruiPatterns-synth" );

			if ( syn ) {
				this.expandSynth( syn.dataset.id, true );
			}
		};
		this.#elements.lists.synth.ondblclick = e => {
			if ( e.target.classList.contains( "mzruiPatterns-synth-info" ) ) {
				this.expandSynth( e.target.closest( ".mzruiPatterns-synth" ).dataset.id );
			}
		};
		this.#elements.lists.buffer.onclick =
		this.#elements.lists.slices.onclick =
		this.#elements.lists.drums.onclick = this.#onclickListPatterns.bind( this );
		this.#elements.lists.synth.onclick = this.#onclickSynths.bind( this );
		this.#elements.newSlices.onclick = () => this.onchange( "addPatternSlices" );
		this.#elements.newDrums.onclick = () => this.onchange( "addPatternDrums" );
		this.#elements.newSynth.onclick = () => this.onchange( "addSynth" );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( this.#children );
			this.#children = null;
		}
	}

	// .........................................................................
	expandSynth( id, b ) {
		const elSyn = this.#getSynth( id );
		const show = elSyn.classList.toggle( "mzruiPatterns-synth-expanded", b );

		elSyn.querySelector( ".mzruiPatterns-synth-expand" ).dataset.icon = `caret-${ show ? "down" : "right" }`;
	}
	reorderPatterns( patterns ) {
		mzruiReorder.listReorder( this.#elements.lists.buffer, patterns );
		mzruiReorder.listReorder( this.#elements.lists.slices, patterns );
		mzruiReorder.listReorder( this.#elements.lists.drums, patterns );
		Array.prototype.forEach.call( this.#nlKeysLists, list => {
			mzruiReorder.listReorder( list, patterns );
		} );
	}
	#openChannelsPopup( action, objId, currChanId ) {
		mzruiChannels.openSelectChannelPopup( currChanId )
			.then( chanId => chanId && this.onchange( action, objId, chanId ) );
	}
	#openInfoPopup( id, el ) {
		const radio = mzruiPatterns.infoPopupContent.querySelector( `[value="${ el.dataset.bufferType }"]` );

		if ( radio ) {
			radio.checked = true;
		} else {
			const radio = mzruiPatterns.infoPopupContent.querySelector( "input:checked" );

			if ( radio ) {
				radio.checked = false;
			}
		}
		mzruiPatterns.infoPopupContent.querySelector( "[name='bpm']" ).value = el.dataset.bufferBpm;
		mzruiPatterns.infoPopupContent.querySelector( "[name='name']" ).value = el.dataset.name;
		MZRUI.$popup.custom( {
			title: "Buffer's info",
			element: mzruiPatterns.infoPopupContent,
			submit: data => {
				data.bpm = data.bpm || null;
				this.onchange( "changePatternBufferInfo", id, data );
			}
		} );
	}

	// .........................................................................
	updateChannel( id, name ) {
		this.querySelectorAll( `.mzruiPatterns-btnSolid[data-id="${ id }"] .mzruiPatterns-btnText` )
			.forEach( el => el.textContent = name );
	}

	// .........................................................................
	addSynth( id ) {
		const elSyn = MZRUI.$getTemplate( "mzrui-patterns-synth" );

		elSyn.dataset.id = id;
		this.#elements.lists.synth.prepend( elSyn );
	}
	changeSynth( id, prop, val ) {
		const elSyn = this.#getSynth( id );

		switch ( prop ) {
			case "name": elSyn.querySelector( ".mzruiPatterns-synth-name" ).textContent = val; break;
			case "dest": elSyn.querySelector( ".mzruiPatterns-synth-dest" ).dataset.id = val; break;
			case "destName": elSyn.querySelector( ".mzruiPatterns-synth-dest .mzruiPatterns-btnText" ).textContent = val; break;
		}
	}
	deleteSynth( id ) {
		this.#getSynth( id ).remove();
	}

	// .........................................................................
	addPattern( id, { type, synth } ) {
		const elPat = MZRUI.$getTemplate( "mzrui-patterns-pattern" );

		elPat.dataset.id = id;
		if ( type !== "buffer" ) {
			elPat.querySelector( ".mzruiPatterns-pattern-btnInfo" ).remove();
			elPat.querySelector( ".mzruiPatterns-destArrow" ).remove();
			elPat.querySelector( ".mzruiPatterns-pattern-dest" ).remove();
		} else {
			elPat.querySelector( "[data-action='clone']" ).remove(); // 1.
		}
		this.#getPatternParent( type, synth ).append( elPat );
	}
	changePattern( id, prop, val ) {
		const elPat = this.getPattern( id );

		switch ( prop ) {
			case "data-missing": MZRUI.$setAttribute( elPat, "data-missing", val ); break;
			case "order": elPat.dataset.order = val; break;
			case "name":
				elPat.dataset.name = val;
				elPat.querySelector( ".mzruiPatterns-pattern-name" ).textContent = val;
				break;
			case "dest": elPat.querySelector( ".mzruiPatterns-pattern-dest" ).dataset.id = val; break;
			case "destName": elPat.querySelector( ".mzruiPatterns-pattern-dest .mzruiPatterns-btnText" ).textContent = val; break;
			case "synth": this.#getPatternParent( "keys", val ).append( elPat ); break;
			case "bufferType":
				MZRUI.$setAttribute( elPat, "data-buffer-type", val );
				elPat.querySelector( ".mzruiPatterns-pattern-btnInfo" ).dataset.icon = `buf-${ val || "undefined" }`;
				break;
			case "bufferBpm":
				MZRUI.$setAttribute( elPat, "data-buffer-bpm", val );
				break;
		}
	}
	appendPatternSVG( id, svg ) {
		svg.classList.add( "mzruiPatterns-pattern-svg" );
		this.getPattern( id ).querySelector( ".mzruiPatterns-pattern-content" ).append( svg );
	}
	deletePattern( id ) {
		const elPat = this.getPattern( id );

		if ( elPat ) { // 2.
			elPat.remove();
		}
	}

	// .........................................................................
	selectPattern( type, id ) {
		const elList = this.#elements.lists[ type === "keys" ? "synth" : type ];

		elList.querySelector( ".mzruiPatterns-pattern-selected" )?.classList?.remove( "mzruiPatterns-pattern-selected" );
		this.getPattern( id )?.classList?.add( "mzruiPatterns-pattern-selected" );
	}
	selectSynth( id ) {
		this.#elements.lists.synth.querySelector( ".mzruiPatterns-synth-selected" )?.classList?.remove( "mzruiPatterns-synth-selected" );
		this.#getSynth( id ).classList.add( "mzruiPatterns-synth-selected" );
	}

	// .........................................................................
	getPattern( id ) {
		return this.querySelector( `.mzruiPatterns-pattern[data-id="${ id }"]` );
	}
	#getSynth( id ) {
		return this.#elements.lists.synth.querySelector( `.mzruiPatterns-synth[data-id="${ id }"]` );
	}
	#getPatternParent( type, synthId ) {
		switch ( type ) {
			case "slices":
			case "buffer":
			case "drums": return this.#elements.lists[ type ];
			case "keys": return this.#elements.lists.synth.querySelector( `.mzruiPatterns-synth[data-id="${ synthId }"] .mzruiPatterns-synth-patterns` );
		}
	}

	// .........................................................................
	#onreorderPatterns( list, elPat ) {
		this.onchange( "reorderPattern", elPat.dataset.id,
			mzruiReorder.listComputeOrderChange( list, {} ) );
	}
	#onreorderPatternsKeys( elPat, indA, indB, parA, parB ) {
		if ( parA === parB ) {
			this.#onreorderPatterns( parA, elPat );
		} else {
			const patId = elPat.dataset.id;
			const synth = parB.parentNode.dataset.id;
			const patterns = { [ patId ]: { synth } };

			mzruiReorder.listComputeOrderChange( parA, patterns );
			mzruiReorder.listComputeOrderChange( parB, patterns );
			this.onchange( "redirectPatternKeys", patId, synth, patterns );
		}
	}
	#onclickListPatterns( e ) {
		const pat = e.target.closest( ".mzruiPatterns-pattern" );

		if ( pat ) {
			this.#fnsPattern[ e.target.dataset.action ]( pat.dataset.id, pat, e );
			return false;
		}
	}
	#onclickSynths( e ) {
		if ( this.#onclickListPatterns( e ) !== false ) {
			const syn = e.target.closest( ".mzruiPatterns-synth" );

			if ( syn ) {
				this.#fnsSynth[ e.target.dataset.action ]( syn.dataset.id, e );
			}
		}
	}
}

Object.freeze( mzruiPatterns );
customElements.define( "mzrui-patterns", mzruiPatterns );

/*
1. The cloning feature for the patterns of type buffer is removed because it's for the moment useless.
2. We are checking if the pattern exists because the entire synth could have been removed before.
*/
