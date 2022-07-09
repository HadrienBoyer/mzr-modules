"use strict";

class mzruiSlicer extends HTMLElement {
	static #resW = 1000;
	static #resH = 64;

	#dur = 4;
	#tool = "";
	#slices = {};
	#buffer = null;
	#ptrmoveFn = null;
	#stepsPerBeat = 4;
	#slicesMaxId = 0;
	#slicesSaved = null;
	#slicesSplitted = null;
	#sliceIdBefore = null;
	#sliceCurrentTime = null;
	#onresizeBind = this.#onresize.bind( this );
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiSlicer" );
	#children = MZRUI.$getTemplate( "mzrui-slicer" );
	#waveDef = MZRUI.$createElementSVG( "polyline" );
	#elements = MZRUI.$findElements( this.#children, {
		sourceCurrentTime: ".mzruiSlicer-source-currentTime",
		slicesCurrentTime: ".mzruiSlicer-slices-currentTime",
		previewCurrentTime: ".mzruiSlicer-preview-currentTime",
		beatlines: [
			"mzrui-beatlines:first-child",
			"mzrui-beatlines:last-child",
		],
		srcName: ".mzruiSlicer-source-name",
		srcWave: ".mzruiSlicer-source-wave",
		diagonalLine: ".mzruiSlicer-slices-line",
		timeline: "mzrui-timeline",
		preview: ".mzruiSlicer-preview",
		slices: ".mzruiSlicer-slices-wrap",
		step: ".mzruiSlicer-btn-step",
		tools: {
			moveY: ".mzruiSlicer-btn[data-action='moveY']",
			reset: ".mzruiSlicer-btn[data-action='reset']",
			split: ".mzruiSlicer-btn[data-action='split']",
			merge: ".mzruiSlicer-btn[data-action='merge']",
		},
	} );
	timeline = this.#elements.timeline;

	constructor() {
		const defs = document.querySelector( "#mzruiSlicer-waveDefs defs" );

		super();
		Object.seal( this );

		if ( !defs ) {
			document.body.prepend( MZRUI.$createElementSVG( "svg", { id: "mzruiSlicer-waveDefs" },
				MZRUI.$createElementSVG( "defs" ),
			) );
			this.#waveDef.dataset.id = 1;
		} else {
			this.#waveDef.dataset.id = 1 + Array.prototype.reduce.call( defs.children,
				( max, p ) => Math.max( max, p.dataset.id ), 0 );
		}
		this.#waveDef.id = `mzruiSlicer-waveDef-${ this.#waveDef.dataset.id }`;
		this.#elements.slices.oncontextmenu = () => false;
		this.#elements.slices.onpointerdown = this.#onpointerdownSlices.bind( this );
		this.#elements.step.onclick = this.#onclickStep.bind( this );
		this.#elements.tools.moveY.onclick =
		this.#elements.tools.reset.onclick =
		this.#elements.tools.split.onclick =
		this.#elements.tools.merge.onclick = this.#onclickTools.bind( this );
		this.ondrop = e => {
			const patId = e.dataTransfer.getData( "pattern-buffer" );

			if ( patId && MZRUI.$getAttribute( this, "disabled" ) === null ) {
				this.#dispatch( "dropBuffer", patId );
			}
		};
		MZRUI.$listenEvents( this, {
			mzruiTimeline: {
				changeCurrentTime: d => {
					MZRUI.$setAttribute( this, "currenttime", d.args[ 0 ] );
					return true;
				},
			},
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( this.#children ) {
			MZRUI.$setAttribute( this, "tabindex", -1 );
			this.append( ...this.#children );
			this.#children = null;
			MZRUI.$recallAttributes( this, {
				currenttime: 0,
				step: 1,
				duration: 4,
				timedivision: "4/4",
				hidetimes: true,
			} );
			this.#selectTool( "moveY" );
		}
		document.querySelector( "#mzruiSlicer-waveDefs defs" ).append( this.#waveDef );
		MZRUI.$observeSizeOf( this, this.#onresizeBind );
	}
	disconnectedCallback() {
		this.#waveDef.remove();
		MZRUI.$unobserveSizeOf( this, this.#onresizeBind );
	}
	static get observedAttributes() {
		return [ "currenttime", "duration", "step", "timedivision" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( !this.#children && prev !== val ) {
			switch ( prop ) {
				case "timedivision":
					this.#stepsPerBeat = +val.split( "/" )[ 1 ];
					MZRUI.$setAttribute( this.#elements.timeline, "timedivision", val );
					MZRUI.$setAttribute( this.#elements.beatlines[ 0 ], "timedivision", val );
					MZRUI.$setAttribute( this.#elements.beatlines[ 1 ], "timedivision", val );
					break;
				case "currenttime":
					this.#setCurrentTime( +val );
					break;
				case "duration":
					this.#dur = +val;
					this.#updatePxPerBeat();
					break;
				case "step":
					this.#elements.step.firstChild.textContent = this.#convertStepToFrac( +val );
					break;
			}
		}
	}

	// .........................................................................
	getSlicesData() {
		return this.#copySlicesData();
	}
	setBufferName( name ) {
		this.#elements.srcName.textContent = name;
	}
	setBuffer( buf ) {
		this.#buffer = buf || null;
		this.classList.toggle( "mzruiSlicer-loaded", this.#buffer );
		this.classList.toggle( "mzruiSlicer-missingBufferData", !this.#buffer );
		this.#setWaveform( buf );
	}
	removeBuffer() {
		this.#buffer = null;
		this.classList.remove( "mzruiSlicer-loaded" );
		this.setBufferName( "" );
		this.#setWaveform( null );
	}
	addSlice( id, obj ) {
		if ( !( id in this.#slices ) ) {
			const svg = MZRUI.$createElementSVG( "svg", { class: "mzruiSlicer-preview-wave", "data-id": id, preserveAspectRatio: "none" },
				MZRUI.$createElementSVG( "use" ),
			);
			const sli = MZRUI.$createElement( "div", { class: "mzruiSlicer-slices-slice", "data-id": id } );

			this.#slicesMaxId = Math.max( this.#slicesMaxId, id );
			svg.firstChild.setAttributeNS( "http://www.w3.org/1999/xlink", "href", `#${ this.#waveDef.id }` );
			this.#slices[ id ] = Object.seal( { id, svg, sli, x: 0, y: 0, w: 0 } );
			this.changeSlice( id, obj );
			this.#elements.preview.append( svg );
			this.#elements.slices.append( sli );
		}
	}
	changeSlice( id, obj ) {
		const t = this.#getTimeNorm();
		const sli = this.#slices[ id ];
		const x = +( obj.x ?? sli.x ).toFixed( 10 );
		const y = +( obj.y ?? sli.y ).toFixed( 10 );
		const w = +( obj.w ?? sli.w ).toFixed( 10 );

		if ( "x" in obj || "w" in obj ) {
			sli.x = x;
			sli.w = w;
			sli.svg.style.left =
			sli.sli.style.left = `${ x * 100 }%`;
			sli.svg.style.width =
			sli.sli.style.width = `${ w * 100 }%`;
		}
		if ( "y" in obj ) {
			sli.y = y;
			sli.sli.style.height = `${ ( 1 - y ) * 100 }%`;
		}
		MZRUI.$setAttribute( sli.svg, "viewBox", `${ ( x - ( x - y ) ) * mzruiSlicer.#resW } 0 ${ w * mzruiSlicer.#resW } ${ mzruiSlicer.#resH }` );
		if ( sli.x <= t && t < sli.x + sli.w ) {
			this.#highlightSlice( sli );
		}
	}
	removeSlice( id ) {
		const sli = this.#slices[ id ];

		if ( sli ) {
			delete this.#slices[ id ];
			sli.svg.remove();
			sli.sli.remove();
			if ( id === this.#slicesMaxId ) {
				this.#slicesMaxId = Object.keys( this.#slices )
					.reduce( ( max, k ) => Math.max( max, k ), 0 );
			}
			if ( sli === this.#sliceCurrentTime ) {
				this.#highlightSlice( null );
			}
		}
	}

	// .........................................................................
	#getTimeNorm() {
		return MZRUI.$getAttributeNum( this, "currenttime" ) / MZRUI.$getAttributeNum( this, "duration" );
	}
	#setWaveform( buf ) {
		if ( buf ) {
			mzruiWaveform.drawBuffer( this.#waveDef, mzruiSlicer.#resW, mzruiSlicer.#resH, buf );
			mzruiWaveform.drawBuffer( this.#elements.srcWave.firstChild, mzruiSlicer.#resW, mzruiSlicer.#resH, buf );
		} else {
			this.#waveDef.removeAttribute( "points" );
			this.#elements.srcWave.firstChild.removeAttribute( "points" );
		}
	}
	#setCurrentTime( beat ) {
		const t = this.#getTimeNorm();

		MZRUI.$setAttribute( this.#elements.timeline, "currenttime", beat );
		this.#elements.slicesCurrentTime.style.left = `${ t * 100 }%`;
		this.#elements.previewCurrentTime.style.left = `${ t * 100 }%`;
		MZRUI.$setAttribute( this, "hidetimes", t <= 0 || t >= .995 );
		this.#updateCurrentTime( t );
	}
	#updateCurrentTime( t ) {
		const sli = Object.values( this.#slices ).find( s => s.x <= t && t < s.x + s.w );
		const srcT = sli ? Math.min( sli.y + ( t - sli.x ), 1 ) : t;

		this.#elements.sourceCurrentTime.style.left = `${ srcT * 100 }%`;
		this.#highlightSlice( sli );
	}
	#highlightSlice( sli ) {
		if ( sli !== this.#sliceCurrentTime ) {
			if ( this.#sliceCurrentTime ) {
				this.#sliceCurrentTime.sli.classList.remove( "mzruiSlicer-slices-slice-hl" );
				this.#sliceCurrentTime.svg.classList.remove( "mzruiSlicer-preview-wave-hl" );
			}
			if ( sli ) {
				sli.sli.classList.add( "mzruiSlicer-slices-slice-hl" );
				sli.svg.classList.add( "mzruiSlicer-preview-wave-hl" );
			}
			this.#sliceCurrentTime = sli;
		}
	}
	#selectTool( t, change ) {
		if ( change !== false ) {
			this.#tool = t;
		}
		this.#elements.tools.moveY.classList.toggle( "mzruiSlicer-btn-toggle", t === "moveY" );
		this.#elements.tools.reset.classList.toggle( "mzruiSlicer-btn-toggle", t === "reset" );
		this.#elements.tools.merge.classList.toggle( "mzruiSlicer-btn-toggle", t === "merge" );
		this.#elements.tools.split.classList.toggle( "mzruiSlicer-btn-toggle", t === "split" );
	}
	#updatePxPerBeat( dur ) {
		MZRUI.$setAttribute( this.#elements.timeline, "pxperbeat", this.#elements.slices.clientWidth / ( dur || this.#dur ) );
		MZRUI.$setAttribute( this.#elements.beatlines[ 0 ], "pxperbeat", this.#elements.slices.clientWidth / ( dur || this.#dur ) );
		MZRUI.$setAttribute( this.#elements.beatlines[ 1 ], "pxperbeat", this.#elements.slices.clientHeight / ( dur || this.#dur ) );
	}
	#convertStepToFrac( step ) {
		return (
			step >= 1 ? "1" :
			step >= .5 ? "1 / 2" :
			step >= .25 ? "1 / 4" : "1 / 8"
		);
	}
	#getSliceByPageX( offsetX ) {
		const x = MZRUI.$clamp( offsetX / this.#elements.slices.clientWidth, 0, .9999 );

		return Object.values( this.#slices ).find( s => s.x <= x && x < s.x + s.w );
	}
	#copySlicesData() {
		return Object.values( this.#slices ).reduce( ( obj, s ) => {
			obj[ s.id ] = { x: s.x, y: s.y, w: s.w };
			return obj;
		}, {} );
	}

	// .........................................................................
	#onresize() {
		const svg = this.#elements.diagonalLine;
		const w = svg.clientWidth;
		const h = svg.clientHeight;

		MZRUI.$setAttribute( svg, "viewBox", `0 0 ${ w } ${ h }` );
		MZRUI.$setAttribute( svg.firstChild, "x2", w );
		MZRUI.$setAttribute( svg.firstChild, "y2", h );
		this.#updatePxPerBeat();
	}
	#onclickStep() {
		const v = MZRUI.$getAttributeNum( this, "step" );
		const frac =
			v >= 1 ? 2 :
			v >= .5 ? 4 :
			v >= .25 ? 8 : 1;

		MZRUI.$setAttribute( this, "step", 1 / frac );
	}
	#onclickTools( e ) {
		this.#selectTool( e.target.dataset.action );
	}
	#onpointerdownSlices( e ) {
		if ( e.button === 0 || e.button === 2 ) {
			this.#ptrmoveFn = this.#tool === "reset" || e.button === 2
				? this.#onpointermoveSlicesReset.bind( this )
				: this.#tool === "moveY" && e.button === 0
					? this.#onpointermoveSlicesY.bind( this )
					: this.#tool === "split" && e.button === 0
						? this.#onpointermoveSlicesSplit.bind( this )
						: this.#tool === "merge" && e.button === 0
							? this.#onpointermoveSlicesMerge.bind( this )
							: null;
			if ( this.#ptrmoveFn ) {
				const sli = this.#getSliceByPageX( e.offsetX );

				MZRUI.$unselectText();
				this.#slicesSaved = this.#copySlicesData();
				this.#elements.slices.setPointerCapture( e.pointerId );
				this.#elements.slices.onpointerup = this.#onpointerupSlices.bind( this );
				this.#elements.slices.onpointermove = this.#onpointermoveSlices.bind( this );
				this.#slicesSplitted = {};
				this.#sliceIdBefore = sli.id;
				this.#onpointermoveSlices( e );
				if ( e.button === 2 ) {
					this.#selectTool( "reset", false );
				}
			}
		}
	}
	#onpointerupSlices( e ) {
		const diff = MZRUI.$diffObjects( this.#slicesSaved, this.#copySlicesData() );

		this.#elements.slices.releasePointerCapture( e.pointerId );
		this.#elements.slices.onpointermove =
		this.#elements.slices.onpointerup =
		this.#slicesSplitted =
		this.#sliceIdBefore =
		this.#slicesSaved = null;
		this.#selectTool( this.#tool );
		if ( diff ) {
			this.#dispatch( "changeProp", "slices", diff );
		}
	}
	#onpointermoveSlices( e ) {
		const sli = this.#getSliceByPageX( e.offsetX );
		const bef = this.#slices[ this.#sliceIdBefore ];
		const xa = Math.min( bef.x, sli.x );
		const xb = Math.max( bef.x, sli.x );
		const list = Object.values( this.#slices ).filter( s => xa <= s.x && s.x <= xb );
		const sliId = this.#ptrmoveFn( list, sli, e );

		this.#sliceIdBefore = sliId ?? sli.id;
	}
	#onpointermoveSlicesY( list, _sli, e ) {
		const dur = MZRUI.$getAttributeNum( this, "duration" );
		const step = MZRUI.$getAttributeNum( this, "step" );
		const yyy = MZRUI.$clamp( e.offsetY / this.#elements.slices.clientHeight, 0, 1 );
		const yy = Math.floor( yyy * dur * this.#stepsPerBeat / step ) * step;
		const y = yy / dur / this.#stepsPerBeat;

		list.forEach( sli => {
			if ( sli.y !== y ) {
				this.changeSlice( sli.id, { y } );
			}
		} );
	}
	#onpointermoveSlicesReset( list ) {
		list.forEach( sli => {
			if ( sli.y !== sli.x ) {
				this.changeSlice( sli.id, { y: sli.x } );
			}
		} );
	}
	#onpointermoveSlicesSplit( list ) {
		list.forEach( sli => {
			if ( !( sli.id in this.#slicesSplitted ) && sli.w > 1 / 128 ) {
				const w2 = sli.w / 2;
				const newId = this.#slicesMaxId + 1;
				const newSli = {
					x: sli.x + w2,
					y: sli.y,
					w: w2,
				};

				this.#slicesSplitted[ newId ] =
				this.#slicesSplitted[ sli.id ] = true;
				this.changeSlice( sli.id, { w: w2 } );
				this.addSlice( newId, newSli );
			}
		} );
	}
	#onpointermoveSlicesMerge( list, sli ) {
		if ( sli.id !== this.#sliceIdBefore ) {
			const first = list.reduce( ( min, s ) => min.x < s.x ? min : s );

			this.changeSlice( first.id, { w: list.reduce( ( w, s ) => w + s.w, 0 ) } );
			list.forEach( sli => {
				if ( sli.id !== first.id ) {
					this.removeSlice( sli.id );
				}
			} );
			return first.id;
		}
	}
}

Object.freeze( mzruiSlicer );
customElements.define( "mzrui-slicer", mzruiSlicer );
