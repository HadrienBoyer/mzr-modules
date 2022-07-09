"use strict";

class mzruiTimeline extends HTMLElement {
	#status = "";
	#step = 1;
	#offset = null;
	#scrollingAncestor = null;
	#mousedownLoop = "";
	#onlyBigMeasures = false;
	#mousedownDate = 0;
	#mousemoveBeat = 0;
	#mousedownBeat = 0;
	#mousedownLoopA = 0;
	#mousedownLoopB = 0;
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiTimeline" );
	#onscrollBind = this.#onscroll.bind( this );
	#onresizeBind = this.#onresize.bind( this );
	#onmouseupBind = this.#onmouseup.bind( this );
	#onmousemoveBind = this.#onmousemove.bind( this );
	#children = MZRUI.$getTemplate( "mzrui-timeline" );
	#elements = MZRUI.$findElements( this.#children, {
		steps: ".mzruiTimeline-steps",
		beats: ".mzruiTimeline-beats",
		measures: ".mzruiTimeline-measures",
		loop: ".mzruiTimeline-loop",
		timeLine: ".mzruiTimeline-timeLine",
		cursor: ".mzruiTimeline-cursor",
		cursorPreview: ".mzruiTimeline-cursorPreview",
	} );

	constructor() {
		super();
		this.beatsPerMeasure = 4;
		this.stepsPerBeat = 4;
		this.pxPerBeat = 10;
		this.pxPerMeasure = this.beatsPerMeasure * this.pxPerBeat;
		this.loopA =
		this.loopB = 0;
		this.looping = false;
		Object.seal( this );

		this.#elements.cursorPreview.remove();
		this.onmousedown = this.#onmousedown.bind( this );
	}

	static numbering( from ) {
		document.body.style.setProperty( "--mzruiTimeline-numbering", +from );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( ...this.#children );
			this.#children = null;
			if ( !this.hasAttribute( "step" ) ) {
				MZRUI.$setAttribute( this, "step", 1 );
			}
		}
		this.#scrollingAncestor = this.#closestScrollingAncestor( this.parentNode );
		this.#scrollingAncestor.addEventListener( "scroll", this.#onscrollBind );
		MZRUI.$observeSizeOf( this.#scrollingAncestor, this.#onresizeBind );
		this.#updateOffset();
		this.#updateNumberMeasures();
		this.#updateMeasures();
	}
	disconnectedCallback() {
		this.#scrollingAncestor.removeEventListener( "scroll", this.#onscrollBind );
		MZRUI.$unobserveSizeOf( this.#scrollingAncestor, this.#onresizeBind );
	}
	static get observedAttributes() {
		return [ "step", "timedivision", "pxperbeat", "loop", "currenttime", "currenttime-preview" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "step": this.#step = +val; break;
				case "loop": this.#changeLoop( val ); break;
				case "pxperbeat": this.#changePxPerBeat( +val ); break;
				case "currenttime": this.#changeCurrentTime( +val ); break;
				case "timedivision": this.#changeTimedivision( val ); break;
				case "currenttime-preview": this.#changeCurrentTimePreview( val === null ? null : +val ); break;
			}
		}
	}

	// .........................................................................
	#changePxPerBeat( ppb ) {
		const stepsOpa = Math.max( 0, Math.min( ( ppb - 32 ) / 256, .5 ) );
		const beatsOpa = Math.max( 0, Math.min( ( ppb - 20 ) / 40, .6 ) );
		const measuresOpa = Math.max( 0, Math.min( ( ppb - 6 ) / 20, .7 ) );

		this.pxPerBeat = ppb;
		this.pxPerMeasure = this.beatsPerMeasure * ppb;
		this.#onlyBigMeasures = ppb < 6;
		this.style.fontSize = `${ ppb }px`;
		this.style.setProperty( "--mzruiTimeline-beats-incr", this.#onlyBigMeasures ? this.beatsPerMeasure : 1 );
		this.style.setProperty( "--mzruiTimeline-measures-opacity", measuresOpa );
		this.#elements.steps.style.opacity = stepsOpa;
		this.#elements.beats.style.opacity = beatsOpa;
		if ( this.#scrollingAncestor ) {
			this.#updateOffset();
			this.#updateNumberMeasures();
			this.#updateMeasures();
		}
	}
	#changeTimedivision( val ) {
		const ts = val.split( "/" );

		this.beatsPerMeasure = +ts[ 0 ];
		this.stepsPerBeat = +ts[ 1 ];
		this.pxPerMeasure = this.beatsPerMeasure * this.pxPerBeat;
		this.style.setProperty( "--mzruiTimeline-beats-per-measure", this.beatsPerMeasure );
		this.#updateStepsBg();
		if ( this.#scrollingAncestor ) {
			this.#updateNumberMeasures();
			this.#updateMeasures();
		}
	}
	#changeLoop( val ) {
		const [ a, b ] = ( val || "0-0" ).split( "-" );

		this.looping = !!val;
		this.loopA = +a;
		this.loopB = +b;
		this.#updateLoop();
	}
	#changeCurrentTime( t ) {
		this.#elements.cursor.style.left = `${ t }em`;
	}
	#changeCurrentTimePreview( t ) {
		if ( t === null ) {
			this.#elements.cursorPreview.remove();
		} else {
			const rnd = this.beatRound( t );

			if ( t.toFixed( 3 ) !== rnd.toFixed( 3 ) ) {
				MZRUI.$setAttribute( this, "currenttime-preview", rnd );
			} else {
				this.#elements.cursorPreview.style.left = `${ t }em`;
				if ( !this.#elements.cursorPreview.parentNode ) {
					this.#elements.timeLine.append( this.#elements.cursorPreview );
				}
			}
		}
	}

	// .........................................................................
	beatCeil( beat ) { return this.#beatCalc( Math.ceil, beat ); }
	beatRound( beat ) { return this.#beatCalc( Math.round, beat ); }
	beatFloor( beat ) { return this.#beatCalc( Math.floor, beat ); }
	#beatCalc( mathFn, beat ) {
		const mod = 1 / this.stepsPerBeat * this.#step;

		return mathFn( beat / mod ) * mod;
	}

	// .........................................................................
	#closestScrollingAncestor( el ) {
		const ov = getComputedStyle( el ).overflowX;

		return ov === "auto" || ov === "scroll" || el === document.body
			? el
			: this.#closestScrollingAncestor( el.parentNode );
	}
	#setStatus( st ) {
		this.classList.remove( `mzruiTimeline-${ this.#status }` );
		this.classList.toggle( `mzruiTimeline-${ st }`, !!st );
		this.#status = st;
	}
	#getBeatByPageX( pageX ) {
		const bcrX = this.#elements.timeLine.getBoundingClientRect().x;

		return Math.max( 0, this.beatRound( ( pageX - bcrX ) / this.pxPerBeat ) );
	}
	#updateStepsBg() {
		const sPB = this.stepsPerBeat;
		const dots = [];

		for ( let i = 1; i < sPB; ++i ) {
			dots.push(
				`transparent calc( ${ i / sPB }em - 1px )`,
				`currentColor calc( ${ i / sPB }em - 1px )`,
				`currentColor calc( ${ i / sPB }em + 1px )`,
				`transparent calc( ${ i / sPB }em + 1px )` );
		}
		this.#elements.steps.style.backgroundImage = `
			repeating-linear-gradient(90deg, transparent 0em,
				${ dots.join( "," ) },
				transparent calc( ${ 1 }em )
			)
		`;
	}
	#updateOffset() {
		const offBeats = Math.floor( this.#scrollingAncestor.scrollLeft / this.pxPerMeasure );
		const off = this.#onlyBigMeasures
			? Math.floor( offBeats / this.beatsPerMeasure ) * this.beatsPerMeasure
			: offBeats;
		const diff = off !== this.#offset;

		if ( diff ) {
			this.#offset = off;
			this.style.setProperty( "--mzruiTimeline-beats-offset", off );
		}
		return diff;
	}
	#updateNumberMeasures() {
		const elMeasures = this.#elements.measures;
		const px = this.pxPerMeasure * ( this.#onlyBigMeasures ? this.beatsPerMeasure : 1 );
		const nb = Math.ceil( this.#scrollingAncestor.clientWidth / px ) + 1;

		if ( nb < 0 || nb > 500 ) {
			return console.warn( "mzruiTimeline: anormal number of nodes to create", nb );
		} else if ( elMeasures.children.length > nb ) {
			while ( elMeasures.children.length > nb ) {
				elMeasures.lastChild.remove();
			}
		} else {
			while ( elMeasures.children.length < nb ) {
				elMeasures.append( MZRUI.$createElement( "span", { class: "mzruiTimeline-measure" } ) );
			}
		}
	}
	#updateMeasures() {
		Array.prototype.forEach.call( this.#elements.measures.children, ( el, i ) => {
			el.classList.toggle( "mzruiTimeline-measureBig",
				this.#onlyBigMeasures || ( this.#offset + i ) % this.beatsPerMeasure === 0 );
		} );
	}
	#updateLoop() {
		this.classList.toggle( "mzruiTimeline-looping", this.looping );
		if ( this.looping ) {
			this.#elements.loop.style.left = `${ this.loopA }em`;
			this.#elements.loop.style.width = `${ this.loopB - this.loopA }em`;
		}
	}

	// .........................................................................
	#onscroll() {
		if ( this.#updateOffset() && !this.#onlyBigMeasures ) {
			this.#updateMeasures();
		}
	}
	#onresize() {
		this.#updateNumberMeasures();
		this.#updateMeasures();
	}
	#onmousedown( e ) {
		const loopLine = e.target.classList.contains( "mzruiTimeline-loopLine" );

		if ( loopLine && Date.now() - this.#mousedownDate > 500 ) {
			this.#mousedownDate = Date.now();
		} else {
			this.#setStatus(
				e.target === this.#elements.cursor.parentNode ? "draggingTime" :
				e.target.classList.contains( "mzruiTimeline-loopBody" ) ? "draggingLoopBody" :
				e.target.classList.contains( "mzruiTimeline-loopHandleA" ) ? "draggingLoopHandleA" :
				e.target.classList.contains( "mzruiTimeline-loopHandleB" ) || loopLine ? "draggingLoopHandleB" : "" );
			if ( this.#status ) {
				this.#mousemoveBeat = null;
				this.#mousedownBeat = this.#getBeatByPageX( e.pageX );
				if ( loopLine ) {
					this.loopA =
					this.loopB = this.#mousedownBeat;
					this.#dispatch( "inputLoopStart" );
				} else {
					this.#dispatch( "inputCurrentTimeStart" );
				}
				this.#mousedownLoop = MZRUI.$getAttribute( this, "loop" );
				this.#mousedownLoopA = this.loopA;
				this.#mousedownLoopB = this.loopB;
				document.addEventListener( "mousemove", this.#onmousemoveBind );
				document.addEventListener( "mouseup", this.#onmouseupBind );
				MZRUI.$unselectText();
				this.#onmousemove( e );
			}
		}
	}
	#onmousemove( e ) {
		const beat = this.#getBeatByPageX( e.pageX );
		const beatRel = beat - this.#mousedownBeat;

		if ( beatRel !== this.#mousemoveBeat ) {
			this.#mousemoveBeat = beatRel;
			switch ( this.#status ) {
				case "draggingTime":
					MZRUI.$setAttribute( this, "currenttime-preview", beat );
					this.#dispatch( "inputCurrentTime", beat );
					break;
				case "draggingLoopBody": {
					const rel = Math.max( -this.#mousedownLoopA, beatRel );
					const a = this.#mousedownLoopA + rel;
					const b = this.#mousedownLoopB + rel;
					const loop = `${ a }-${ b }`;

					if ( loop !== MZRUI.$getAttribute( this, "loop" ) ) {
						MZRUI.$setAttribute( this, "loop", loop );
						this.#dispatch( "inputLoop", a, b );
					}
				} break;
				case "draggingLoopHandleA":
				case "draggingLoopHandleB": {
					const handA = this.#status === "draggingLoopHandleA";
					const rel = handA
						? Math.max( -this.#mousedownLoopA, beatRel )
						: beatRel;
					const a = this.#mousedownLoopA + ( handA ? rel : 0 );
					const b = this.#mousedownLoopB + ( handA ? 0 : rel );
					const aa = Math.min( a, b );
					const bb = Math.max( a, b );
					const loop = `${ aa }-${ bb }`;

					if ( a > b ) {
						if ( handA ) {
							this.#setStatus( "draggingLoopHandleB" );
							this.#mousedownLoopA = this.#mousedownLoopB;
						} else {
							this.#setStatus( "draggingLoopHandleA" );
							this.#mousedownLoopB = this.#mousedownLoopA;
						}
						this.#mousedownBeat = this.#mousedownLoopA;
					}
					if ( loop !== MZRUI.$getAttribute( this, "loop" ) ) {
						if ( aa !== bb ) {
							MZRUI.$setAttribute( this, "loop", loop );
							this.#dispatch( "inputLoop", aa, bb );
						} else if ( this.hasAttribute( "loop" ) ) {
							this.removeAttribute( "loop" );
							this.#dispatch( "inputLoop", false );
						}
					}
				} break;
			}
		}
	}
	#onmouseup() {
		document.removeEventListener( "mousemove", this.#onmousemoveBind );
		document.removeEventListener( "mouseup", this.#onmouseupBind );
		switch ( this.#status ) {
			case "draggingTime": {
				const beat = MZRUI.$getAttribute( this, "currenttime-preview" );

				this.removeAttribute( "currenttime-preview" );
				this.#dispatch( "inputCurrentTimeEnd" );
				if ( beat !== MZRUI.$getAttribute( this, "currenttime" ) ) {
					MZRUI.$setAttribute( this, "currenttime", beat );
					this.#dispatch( "changeCurrentTime", +beat );
				}
			} break;
			case "draggingLoopBody":
			case "draggingLoopHandleA":
			case "draggingLoopHandleB":
				this.#dispatch( "inputLoopEnd" );
				if ( MZRUI.$getAttribute( this, "loop" ) !== this.#mousedownLoop ) {
					if ( this.loopA !== this.loopB ) {
						this.#dispatch( "changeLoop", this.loopA, this.loopB );
					} else {
						this.removeAttribute( "loop" );
						this.#dispatch( "changeLoop", false );
					}
				}
				break;
		}
		this.#setStatus( "" );
	}
}

Object.freeze( mzruiTimeline );
customElements.define( "mzrui-timeline", mzruiTimeline );
