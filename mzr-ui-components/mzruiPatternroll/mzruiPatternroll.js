"use strict";

class mzruiPatternroll extends HTMLElement {
	#rowsByTrackId = new Map();
	#tracklist = MZRUI.$createElement( "mzrui-tracklist" );
	#selectionElement = MZRUI.$createElement( "div", { class: "mzruiBlocksManager-selection mzruiBlocksManager-selection-hidden" } );
	#win = MZRUI.$createElement( "mzrui-timewindow", {
		panelsize: 90,
		panelsizemin: 24,
		panelsizemax: 160,
		lineheight: 40,
		lineheightmin: 20,
		lineheightmax: 68,
		pxperbeat: 32,
		pxperbeatmin: 8,
		pxperbeatmax: 160,
	} );
	#blcManager = new mzruiBlocksManager( {
		rootElement: this,
		selectionElement: this.#selectionElement,
		timeline: this.#win.timeline,
		blockDOMChange: this.#blockDOMChange.bind( this ),
		managercallMoving: ( blcsMap, wIncr, trIncr ) => this.onchange( "move", Array.from( blcsMap.keys() ), wIncr, trIncr ),
		managercallDeleting: blcsMap => this.onchange( "deletion", Array.from( blcsMap.keys() ) ),
		managercallSelecting: ids => this.onchange( "selection", ids ),
		managercallUnselecting: () => this.onchange( "unselection" ),
		managercallUnselectingOne: blcId => this.onchange( "unselectionOne", blcId ),
		managercallDuplicating: ( blcsMap, wIncr ) => this.onchange( "duplicate", wIncr ),
		managercallCroppingA: ( blcsMap, wIncr ) => this.onchange( "cropStart", Array.from( blcsMap.keys() ), wIncr ),
		managercallCroppingB: ( blcsMap, wIncr ) => this.onchange( "cropEnd", Array.from( blcsMap.keys() ), wIncr ),
	} );

	constructor() {
		super();
		this.timeline = this.#win.timeline;
		this.onchange =
		this.onaddBlock =
		this.oneditBlock = null;
		Object.seal( this );

		MZRUI.$listenEvents( this, {
			mzruiTimewindow: {
				pxperbeat: d => this.#onmzruiTimewindowPxperbeat( d.args[ 0 ] ),
				lineheight: d => this.#onmzruiTimewindowLineheight( d.args[ 0 ] ),
			},
		} );
		this.#onmzruiTimewindowPxperbeat( 32 );
		this.#onmzruiTimewindowLineheight( 40 );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.classList.add( "mzruiBlocksManager" );
			MZRUI.$setAttribute( this, "tabindex", -1 );
			this.append( this.#win );
			this.#win.querySelector( ".mzruiTimewindow-panelContent" ).append( this.#tracklist );
			this.#win.querySelector( ".mzruiTimewindow-mainContent" ).append( this.#selectionElement );
			this.#win.querySelector( ".mzruiTimewindow-rows" ).ondrop = this.#drop.bind( this );
			this.#win.querySelector( "mzrui-beatlines" ).removeAttribute( "coloredbeats" );
		}
	}
	static get observedAttributes() {
		return [ "currenttime" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "currenttime":
					MZRUI.$setAttribute( this.#win, "currenttime", val );
					break;
			}
		}
	}

	// .........................................................................
	addTrack( id ) {
		const elTrack = this.#tracklist.addTrack( id );
		const row = elTrack.rowElement;

		row.classList.toggle( "mzrui-row-small", this.#blcManager.getFontSize() <= 44 );
		row.onmousedown = this.#rowMousedown.bind( this );
		this.#rowsByTrackId.set( row.dataset.id, row );
		this.#win.querySelector( ".mzruiTimewindow-rows" ).append( row );
	}
	removeTrack( id ) { this.#tracklist.removeTrack( id ); }
	toggleTrack( id, b ) { MZRUI.$setAttribute( this.#tracklist.getTrack( id ), "toggle", b ); }
	renameTrack( id, s ) { MZRUI.$setAttribute( this.#tracklist.getTrack( id ), "name", s ); }
	reorderTrack( id, n ) { MZRUI.$setAttribute( this.#tracklist.getTrack( id ), "order", n ); }

	// .........................................................................
	addBlock( id, obj, { dataReady } ) {
		const elBlc = MZRUI.$getTemplate( "mzrui-patternroll-block" );

		elBlc.dataset.id = id;
		elBlc.dataset.pattern = obj.pattern;
		elBlc.onmousedown = this.#blcMousedown.bind( this, id );
		MZRUI.$setAttribute( elBlc, "data-missing", !dataReady );
		this.#blcManager.getBlocks().set( id, elBlc );
		this.onaddBlock( id, obj, elBlc );
	}
	removeBlock( id ) {
		this.#blcManager.getBlocks().get( id ).remove();
		this.#blcManager.getBlocks().delete( id );
		this.#blcManager.getSelectedBlocks().delete( id );
	}
	changeBlockProp( id, prop, val ) {
		const blc = this.#blcManager.getBlocks().get( id );

		this.#blockDOMChange( blc, prop, val );
		if ( prop === "track" ) {
			blc.dataset.track = val;
		} else if ( prop === "selected" ) {
			val
				? this.#blcManager.getSelectedBlocks().set( id, blc )
				: this.#blcManager.getSelectedBlocks().delete( id );
		}
	}
	updateBlockViewBox( id, obj ) {
		this.oneditBlock( id, obj, this.#blcManager.getBlocks().get( id ) );
	}

	// .........................................................................
	setData( data ) {
		this.#blcManager.setData( data );
	}
	setCallbacks( cb ) {
		this.onchange = cb.onchange;
		this.onaddBlock = cb.onaddBlock;
		this.oneditBlock = cb.oneditBlock;
		this.#blcManager.getOpts().oneditBlock = cb.oneditBlock;
	}
	getBlocks() {
		return this.#blcManager.getBlocks();
	}
	timeDivision( a, b ) {
		MZRUI.$setAttribute( this.#win, "timedivision", `${ a }/${ b }` );
	}
	loop( a, b ) {
		MZRUI.$setAttribute( this.#win, "loop", Number.isFinite( a ) && `${ a }-${ b }` );
	}

	// .........................................................................
	#blockDOMChange( el, prop, val ) {
		switch ( prop ) {
			case "when": el.style.left = `${ val }em`; break;
			case "duration": el.style.width = `${ val }em`; break;
			case "deleted": el.classList.toggle( "mzruiBlocksManager-block-hidden", !!val ); break;
			case "selected": el.classList.toggle( "mzruiBlocksManager-block-selected", !!val ); break;
			case "row": this.#blockDOMChange( el, "track", this.#incrTrackId( el.dataset.track, val ) ); break;
			case "track": {
				const row = this.#getRowByTrackId( val );

				row && row.firstElementChild.append( el );
			} break;
		}
	}

	// .........................................................................
	#getRowByTrackId( id ) { return this.#rowsByTrackId.get( id ); }
	#incrTrackId( id, incr ) {
		const row = this.#getRowByTrackId( id );
		const rowInd = this.#blcManager.getRowIndexByRow( row ) + incr;

		return this.#blcManager.getRowByIndex( rowInd ).dataset.id;
	}

	// .........................................................................
	#onmzruiTimewindowPxperbeat( ppb ) {
		this.#blcManager.setPxPerBeat( ppb );
	}
	#onmzruiTimewindowLineheight( px ) {
		this.#blcManager.setFontSize( px );
		Array.from( this.#blcManager.getRows() ).forEach( el => el.classList.toggle( "mzrui-row-small", px <= 44 ) );
	}

	// .........................................................................
	#rowMousedown( e ) {
		this.#blcManager.onmousedown( e );
		if ( e.button === 0 && !e.shiftKey && this.#blcManager.getSelectedBlocks().size ) {
			this.onchange( "unselection" );
		}
	}
	#blcMousedown( id, e ) {
		e.stopPropagation();
		this.#blcManager.onmousedown( e );
	}
	#drop( e ) {
		const padId =
				e.dataTransfer.getData( "pattern-buffer" ) ||
				e.dataTransfer.getData( "pattern-slices" ) ||
				e.dataTransfer.getData( "pattern-drums" ) ||
				e.dataTransfer.getData( "pattern-keys" );

		if ( padId ) {
			const when = this.#blcManager.roundBeat( this.#blcManager.getWhenByPageX( e.pageX ) );
			const track = this.#blcManager.getRowByIndex( this.#blcManager.getRowIndexByPageY( e.pageY ) ).dataset.id;

			this.onchange( "add", padId, when, track );
		}
	}
}

Object.freeze( mzruiPatternroll );
customElements.define( "mzrui-patternroll", mzruiPatternroll );
