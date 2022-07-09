"use strict";

class mzruiPianoroll extends HTMLElement {
	#rowsByMidi = {};
	#currKeyDuration = 1;
	#uiSliderGroup = MZRUI.$createElement( "mzrui-slidergroup", { beatlines: "" } );
	#selectionElement = MZRUI.$createElement( "div", { class: "mzruiBlocksManager-selection mzruiBlocksManager-selection-hidden" } );
	#slidersSelect = MZRUI.$createElement( "select", { class: "mzruiPianoroll-slidersSelect", size: 6 },
		MZRUI.$createElement( "option", { value: "gain", selected: "" }, "gain" ),
		MZRUI.$createElement( "option", { value: "pan" }, "pan" ),
		MZRUI.$createElement( "option", { value: "lowpass" }, "lowpass" ),
		MZRUI.$createElement( "option", { value: "highpass" }, "highpass" ),
		MZRUI.$createElement( "option", { value: "gainLFOSpeed" }, "gain.lfo.speed" ),
		MZRUI.$createElement( "option", { value: "gainLFOAmp" }, "gain.lfo.amp" ),
	);
	#win = MZRUI.$createElement( "mzrui-timewindow", {
		panelsize: 100,
		panelsizemin: 100,
		panelsizemax: 130,
		lineheight: 20,
		lineheightmin: 12,
		lineheightmax: 32,
		pxperbeat: 64,
		pxperbeatmin: 20,
		pxperbeatmax: 200,
		downpanel: "",
		downpanelsize: 120,
		downpanelsizemin: 120,
		downpanelsizemax: 160,
	} );
	#blcManager = new mzruiBlocksManager( {
		rootElement: this,
		selectionElement: this.#selectionElement,
		timeline: this.#win.timeline,
		blockDOMChange: this.#blockDOMChange.bind( this ),
		managercallDuplicating: ( keysMap, wIncr ) => this.onchange( "clone", Array.from( keysMap.keys() ), wIncr ),
		managercallSelecting: ids => this.onchange( "selection", ids ),
		managercallUnselecting: () => this.onchange( "unselection" ),
		managercallUnselectingOne: keyId => this.onchange( "unselectionOne", keyId ),
		managercallMoving: ( keysMap, wIncr, kIncr ) => this.onchange( "move", Array.from( keysMap.keys() ), wIncr, kIncr ),
		managercallCroppingB: ( keysMap, dIncr ) => this.onchange( "cropEnd", Array.from( keysMap.keys() ), dIncr ),
		managercallDeleting: keysMap => this.onchange( "remove", Array.from( keysMap.keys() ) ),
	} );

	constructor() {
		super();
		this.timeline = this.#win.timeline;
		this.uiKeys = MZRUI.$createElement( "mzrui-keys" );
		this.onchange = null;
		Object.seal( this );

		MZRUI.$listenEvents( this, {
			mzruiTimewindow: {
				pxperbeat: d => this.#onmzruiTimewindowPxperbeat( d.args[ 0 ] ),
				lineheight: d => this.#onmzruiTimewindowLineheight( d.args[ 0 ] ),
			},
			mzruiTimeline: {
				inputLoop: d => this.#onmzruiTimelineChangeLoop( false, ...d.args ),
				changeLoop: d => this.#onmzruiTimelineChangeLoop( true, ...d.args ),
				changeCurrentTime: d => this.#onmzruiTimelineChangeCurrentTime( d.args[ 0 ] ),
			},
			mzruiSliderGroup: {
				input: d => this.#onmzruiSliderGroupInput( d.args[ 1 ] ),
				inputEnd: () => this.#onmzruiSliderGroupInputEnd(),
				change: d => this.#onmzruiSliderGroupChange( d ),
			},
		} );
		this.#slidersSelect.onchange = this.#onchangeSlidersSelect.bind( this );
		this.#onmzruiTimewindowPxperbeat( 64 );
		this.#onmzruiTimewindowLineheight( 20 );
		this.#onchangeSlidersSelect();
		this.reset();
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.classList.add( "mzruiBlocksManager" );
			MZRUI.$setAttribute( this, "tabindex", -1 );
			this.append( this.#win );
			this.#win.querySelector( ".mzruiTimewindow-panelContent" ).append( this.uiKeys );
			this.#win.querySelector( ".mzruiTimewindow-panelContentDown" ).prepend( this.#slidersSelect );
			this.#win.querySelector( ".mzruiTimewindow-contentDown" ).prepend( this.#uiSliderGroup );
			this.#win.querySelector( ".mzruiTimewindow-mainContent" ).append( this.#selectionElement );
			this.scrollToMiddle();
		}
	}
	static get observedAttributes() {
		return [ "disabled", "currenttime" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "disabled":
					MZRUI.$setAttribute( this.#win, "disabled", val );
					break;
				case "currenttime":
					MZRUI.$setAttribute( this.#win, "currenttime", val );
					MZRUI.$setAttribute( this.#uiSliderGroup, "currenttime", val );
					break;
			}
		}
	}

	// .........................................................................
	reset() {
		this.#currKeyDuration = 1;
	}
	setData( data ) {
		this.#blcManager.setData( data );
	}
	setCallbacks( cb ) {
		this.onchange = cb.onchange;
	}
	timeDivision( a, b ) {
		MZRUI.$setAttribute( this.#win, "timedivision", `${ a }/${ b }` );
		MZRUI.$setAttribute( this.#uiSliderGroup, "timedivision", `${ a }/${ b }` );
	}
	loop( a, b ) {
		MZRUI.$setAttribute( this.#win, "loop", Number.isFinite( a ) && `${ a }-${ b }` );
		MZRUI.$setAttribute( this.#uiSliderGroup, "loopa", a );
		MZRUI.$setAttribute( this.#uiSliderGroup, "loopb", b );
	}
	scrollToMiddle() {
		this.#win.scrollTop = this.#win.querySelector( ".mzruiTimewindow-rows" ).clientHeight / 2;
	}
	scrollToKeys() {
		const blc = this.#win.querySelector( ".mzruiBlocksManager-block" );

		if ( blc ) {
			const key = +blc.dataset.keyNote;
			const maxRow = +this.#win.querySelector( ".mzrui-row" ).dataset.midi;

			this.#win.scrollTop = ( maxRow - key - 3.5 ) * MZRUI.$getAttributeNum( this.#win, "lineheight" );
		}
	}
	octaves( from, nb ) {
		const rows = this.uiKeys.octaves( from, nb );

		Object.keys( this.#rowsByMidi ).forEach( k => delete this.#rowsByMidi[ k ] );
		rows.forEach( el => {
			const midi = +el.dataset.midi;

			el.onmousedown = this.#rowMousedown.bind( this, midi );
			this.#rowsByMidi[ midi ] = el;
		} );
		this.#win.querySelector( ".mzruiTimewindow-rows" ).append( ...rows );
		this.#win.querySelector( ".mzruiTimewindow-rows" ).style.height = `${ rows.length }em`;
		this.scrollToMiddle();
		this.reset();
	}

	// Block's UI functions
	// ........................................................................
	addKey( id, obj ) {
		const blc = MZRUI.$getTemplate( "mzrui-pianoroll-block" );
		const dragline = new mzruiDragline();

		blc.dataset.id = id;
		blc.onmousedown = this.#blcMousedown.bind( this, id );
		dragline.onchange = this.#onchangeDragline.bind( this, id );
		blc._dragline = dragline;
		blc._draglineDrop = blc.querySelector( ".mzruiDragline-drop" );
		blc.append( dragline.rootElement );
		dragline.getDropAreas = this.#getDropAreas.bind( this, id );
		this.#blcManager.getBlocks().set( id, blc );
		obj.selected
			? this.#blcManager.getSelectedBlocks().set( id, blc )
			: this.#blcManager.getSelectedBlocks().delete( id );
		this.#uiSliderGroup.set( id, obj.when, obj.duration, obj[ this.#slidersSelect.value ] );
		this.#blockDOMChange( blc, "key", obj.key );
		this.#blockDOMChange( blc, "when", obj.when );
		this.#blockDOMChange( blc, "duration", obj.duration );
		this.#blockDOMChange( blc, "selected", obj.selected );
		this.#blockDOMChange( blc, "pan", obj.pan );
		this.#blockDOMChange( blc, "gain", obj.gain );
		this.#blockDOMChange( blc, "lowpass", obj.lowpass );
		this.#blockDOMChange( blc, "highpass", obj.highpass );
		this.#blockDOMChange( blc, "gainLFOSpeed", obj.gainLFOSpeed );
		this.#blockDOMChange( blc, "gainLFOAmp", obj.gainLFOAmp );
		this.#blockDOMChange( blc, "prev", obj.prev );
		this.#blockDOMChange( blc, "next", obj.next );
	}
	removeKey( id ) {
		const blc = this.#blcManager.getBlocks().get( id );
		const blcPrev = this.#blcManager.getBlocks().get( blc.dataset.prev );

		blc.remove();
		if ( blcPrev ) {
			blcPrev._dragline.linkTo( null );
		}
		this.#blcManager.getBlocks().delete( id );
		this.#blcManager.getSelectedBlocks().delete( id );
		this.#uiSliderGroup.delete( id );
	}
	changeKeyProp( id, prop, val ) {
		const blc = this.#blcManager.getBlocks().get( id );

		this.#blockDOMChange( blc, prop, val );
		if ( val === null ) {
			delete blc.dataset[ prop ];
		} else {
			blc.dataset[ prop === "key" ? "keyNote" : prop ] = val;
		}
		if ( prop === "selected" ) {
			val
				? this.#blcManager.getSelectedBlocks().set( id, blc )
				: this.#blcManager.getSelectedBlocks().delete( id );
		}
	}
	#blockDOMChange( el, prop, val ) {
		switch ( prop ) {
			case "when":
				el.style.left = `${ val }em`;
				this.#uiSliderGroup.setProp( el.dataset.id, "when", val );
				this.#blockRedrawDragline( el );
				break;
			case "duration":
				el.style.width = `${ val }em`;
				this.#uiSliderGroup.setProp( el.dataset.id, "duration", val );
				this.#currKeyDuration = val;
				this.#blockRedrawDragline( el );
				break;
			case "deleted":
				el.classList.toggle( "mzruiBlocksManager-block-hidden", !!val );
				break;
			case "selected":
				el.classList.toggle( "mzruiBlocksManager-block-selected", !!val );
				this.#uiSliderGroup.setProp( el.dataset.id, "selected", !!val );
				break;
			case "row":
				this.#blockDOMChange( el, "key", el.dataset.keyNote - val );
				break;
			case "key": {
				const row = this.#getRowByMidi( val );

				el.dataset.key = mzruiKeys.keyNames.en[ row.dataset.key ];
				row.firstElementChild.append( el );
				this.#blockRedrawDragline( el );
			} break;
			case "prev": {
				const blc = this.#blcManager.getBlocks().get( val );

				el.classList.toggle( "mzruiPianoroll-block-prevLinked", !!val );
				blc && blc._dragline.linkTo( el._draglineDrop );
			} break;
			case "next": {
				const blc = this.#blcManager.getBlocks().get( val );

				el.classList.toggle( "mzruiPianoroll-block-nextLinked", !!val );
				el._dragline.linkTo( blc && blc._draglineDrop );
			} break;
			case "pan":
			case "gain":
			case "lowpass":
			case "highpass":
				this.#blockSliderUpdate( prop, el, val );
				break;
			case "gainLFOAmp":
			case "gainLFOSpeed":
				this.#blockSliderUpdate( prop, el, mzruiPianoroll.#mulToX( val ) );
				break;
		}
	}
	#blockSliderUpdate( nodeName, el, val ) {
		if ( this.#slidersSelect.value === nodeName ) {
			this.#uiSliderGroup.setProp( el.dataset.id, "value", val );
		}
	}
	#blockRedrawDragline( el ) {
		const blcPrev = this.#blcManager.getBlocks().get( el.dataset.prev );

		el._dragline.redraw();
		blcPrev && blcPrev._dragline.redraw();
	}

	// Private small getters
	// ........................................................................
	#getRowByMidi( midi ) { return this.#rowsByMidi[ midi ]; }

	// ........................................................................
	#onmzruiTimewindowPxperbeat( ppb ) {
		this.#blcManager.setPxPerBeat( ppb );
		this.#blcManager.getBlocks().forEach( blc => blc._dragline.redraw() );
		MZRUI.$setAttribute( this.#uiSliderGroup, "pxperbeat", ppb );
	}
	#onmzruiTimewindowLineheight( px ) {
		this.#blcManager.setFontSize( px );
		Array.from( this.#blcManager.getRows() ).forEach( el => el.classList.toggle( "mzrui-row-small", px <= 44 ) );
		this.#blcManager.getBlocks().forEach( blc => blc._dragline.redraw() );
	}
	#onmzruiTimelineChangeCurrentTime( t ) {
		MZRUI.$setAttribute( this.#uiSliderGroup, "currenttime", t );
		return true;
	}
	#onmzruiTimelineChangeLoop( ret, a, b ) {
		MZRUI.$setAttribute( this.#uiSliderGroup, "loopa", a );
		MZRUI.$setAttribute( this.#uiSliderGroup, "loopb", b );
		return ret;
	}
	#onmzruiSliderGroupInput( val ) {
		const prop = this.#slidersSelect.value;

		Array.prototype.find.call( this.#slidersSelect.children,
			o => o.value === prop ).dataset.number = ( prop.startsWith( "gainLFO" )
			? mzruiPianoroll.#xToMul( val )
			: val ).toFixed( 2 );
	}
	#onmzruiSliderGroupInputEnd() {
		const prop = this.#slidersSelect.value;

		delete Array.prototype.find.call( this.#slidersSelect.children,
			o => o.value === prop ).dataset.number;
	}
	#onmzruiSliderGroupChange( d ) {
		const prop = this.#slidersSelect.value;

		d.component = "mzruiPianoroll";
		d.eventName = "changeKeysProps";
		if ( prop.startsWith( "gainLFO" ) ) {
			d.args[ 0 ].forEach( v => v[ 1 ] = mzruiPianoroll.#xToMul( v[ 1 ] ) );
		}
		d.args.unshift( prop );
		return true;
	}
	static #xToMul( x ) {
		switch ( x ) {
			case 6:  return 4;
			case 5:  return 3.5;
			case 4:  return 3;
			case 3:  return 2.5;
			case 2:  return 2;
			case 1:  return 1.5;
			default: return 1;
			case -1: return  .75;
			case -2: return  .5;
			case -3: return  .4;
			case -4: return  .3333;
			case -5: return  .2857;
			case -6: return  .25;
		}
	}
	static #mulToX( mul ) {
		if ( mul >= 4      ) { return 6; }
		if ( mul >= 3.5    ) { return 5; }
		if ( mul >= 3      ) { return 4; }
		if ( mul >= 2.5    ) { return 3; }
		if ( mul >= 2      ) { return 2; }
		if ( mul >= 1.5    ) { return 1; }
		if ( mul >= 1      ) { return 0; }
		if ( mul >=  .75   ) { return -1; }
		if ( mul >=  .5    ) { return -2; }
		if ( mul >=  .4    ) { return -3; }
		if ( mul >=  .3333 ) { return -4; }
		if ( mul >=  .2857 ) { return -5; }
		if ( mul >=  .25   ) { return -6; }
	}

	// ........................................................................
	#blcMousedown( id, e ) {
		const dline = e.currentTarget._dragline.rootElement;

		e.stopPropagation();
		if ( !dline.contains( e.target ) ) {
			this.#blcManager.onmousedown( e );
		}
	}
	#rowMousedown( key, e ) {
		this.#blcManager.onmousedown( e );
		if ( e.button === 0 && !e.shiftKey ) {
			const when = this.#blcManager.roundBeat( this.#blcManager.getWhenByPageX( e.pageX ) );

			this.onchange( "add", key, when, this.#currKeyDuration );
		}
	}
	#onchangeSlidersSelect() {
		const prop = this.#slidersSelect.value;
		const grp = this.#uiSliderGroup;

		switch ( prop ) {
			case "pan":          grp.options( { min: -1, max: 1, def:  0, step: .05 } ); break;
			case "gain":         grp.options( { min:  0, max: 1, def: .8, step: .025 } ); break;
			case "lowpass":      grp.options( { min:  0, max: 1, def:  1, step: .025, exp: 3 } ); break;
			case "highpass":     grp.options( { min:  0, max: 1, def:  1, step: .025, exp: 3 } ); break;
			case "gainLFOAmp":   grp.options( { min: -6, max: 6, def:  0, step: 1 } ); break;
			case "gainLFOSpeed": grp.options( { min: -6, max: 6, def:  0, step: 1 } ); break;
		}
		this.#blcManager.getBlocks().forEach( ( blc, id ) => {
			const val = +blc.dataset[ prop ];
			const val2 = prop.startsWith( "gainLFO" )
				? mzruiPianoroll.#mulToX( val )
				: val;

			this.#uiSliderGroup.setProp( id, "value", val2 );
		} );
	}

	// Key's functions
	// ........................................................................
	#getDropAreas( id ) {
		const d = this.#blcManager.getBlocks().get( id ).dataset;
		const when = +d.when + +d.duration;
		const arr = [];

		this.#blcManager.getBlocks().forEach( blc => {
			const d = blc.dataset;

			if ( +d.when >= when && ( d.prev === undefined || d.prev === id ) ) {
				arr.push( blc.firstElementChild );
			}
		} );
		return arr;
	}
	#onchangeDragline( id, el ) {
		this.onchange( "redirect", id, el ? el.parentNode.dataset.id : null );
	}
}

Object.freeze( mzruiPianoroll );
customElements.define( "mzrui-pianoroll", mzruiPianoroll );
