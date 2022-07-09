"use strict";

class mzruiTimewindow extends HTMLElement {
	#pxPerBeat = 0;
	#panelSize = 0;
	#lineHeight = 0;
	#mousedownPageX = 0;
	#mousedownPageY = 0;
	#onmouseupExtendBind = this.#onmouseupExtend.bind( this );
	#onmousemoveExtendPanelBind = this.#onmousemoveExtendPanel.bind( this );
	#onmousemoveExtendDownPanelBind = this.#onmousemoveExtendDownPanel.bind( this );
	#children = MZRUI.$getTemplate( "mzrui-timewindow" );
	#elements = MZRUI.$findElements( this.#children, {
		main: ".mzruiTimewindow-main",
		down: ".mzruiTimewindow-contentDown",
		panel: ".mzruiTimewindow-panel",
		panelDown: ".mzruiTimewindow-panelContentDown",
		stepBtn: ".mzruiTimewindow-step",
		timeline: "mzrui-timeline",
		beatlines: "mzrui-beatlines",
		loopA: ".mzruiTimewindow-loopA",
		loopB: ".mzruiTimewindow-loopB",
		currentTime: ".mzruiTimewindow-currentTime",
	} );

	constructor() {
		super();
		this.timeline = this.#elements.timeline;
		Object.seal( this );

		MZRUI.$listenEvents( this, {
			mzruiTimeline: {
				inputCurrentTime: MZRUI.$noop,
				changeCurrentTime: d => {
					MZRUI.$setAttribute( this, "currenttime", d.args[ 0 ] );
					return true;
				},
				inputLoop: d => {
					MZRUI.$setAttribute( this, "loop", Number.isFinite( d.args[ 0 ] ) && `${ d.args[ 0 ] }-${ d.args[ 1 ] }` );
					return true;
				},
				inputLoopEnd: () => this.style.overflowY = "",
				inputLoopStart: () => this.style.overflowY = "hidden",
				inputCurrentTimeEnd: () => this.style.overflowY = "",
				inputCurrentTimeStart: () => this.style.overflowY = "hidden",
			},
		} );
		this.ondragstart = () => false;
		this.#elements.main.onwheel = this.#onwheel.bind( this );
		this.#elements.stepBtn.onclick = this.#onclickStep.bind( this );
		this.#elements.main.querySelector( ".mzruiTimewindow-mainContent" ).oncontextmenu = e => e.preventDefault();
		this.#elements.panel.querySelector( ".mzruiTimewindow-panelContent" ).onwheel = this.#onwheelPanel.bind( this );
		this.#elements.panel.querySelector( ".mzruiTimewindow-panelExtendY" ).onmousedown = this.#onmousedownExtend.bind( this, "side" );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.#elements.panel.style.minWidth = `${ MZRUI.$getAttributeNum( this, "panelsize" ) || 100 }px`;
			this.append( ...this.#children );
			if ( this.hasAttribute( "downpanel" ) ) {
				this.#elements.panelDown.firstChild.onmousedown =
				this.#elements.down.firstChild.onmousedown = this.#onmousedownExtend.bind( this, "down" );
				this.#elements.panelDown.style.height =
				this.#elements.down.style.height = `${ MZRUI.$getAttributeNum( this, "downpanelsize" ) || 50 }px`;
			} else {
				this.#elements.panelDown.remove();
				this.#elements.down.remove();
			}
			this.#children = null;
			if ( !this.hasAttribute( "step" ) ) {
				MZRUI.$setAttribute( this, "step", 1 );
			}
			if ( !this.hasAttribute( "pxperbeat" ) ) {
				MZRUI.$setAttribute( this, "pxperbeat", 100 );
			}
			if ( !this.hasAttribute( "lineheight" ) ) {
				MZRUI.$setAttribute( this, "lineheight", 48 );
			}
		}
	}
	static get observedAttributes() {
		return [ "step", "timedivision", "pxperbeat", "lineheight", "currenttime", "loop" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "step":
					MZRUI.$setAttribute( this.#elements.timeline, "step", val );
					this.#elements.stepBtn.firstChild.textContent = this.#convertStepToFrac( +val );
					break;
				case "timedivision":
					MZRUI.$setAttribute( this.#elements.timeline, "timedivision", val );
					MZRUI.$setAttribute( this.#elements.beatlines, "timedivision", val );
					break;
				case "pxperbeat":
					this.#pxPerBeat = +val;
					MZRUI.$setAttribute( this.#elements.timeline, "pxperbeat", val );
					MZRUI.$setAttribute( this.#elements.beatlines, "pxperbeat", val );
					this.style.setProperty( "--mzruiTimewindow-pxperbeat", `${ val }px` );
					this.#elements.currentTime.style.fontSize =
					this.#elements.loopA.style.fontSize =
					this.#elements.loopB.style.fontSize = `${ val }px`;
					break;
				case "lineheight":
					this.#lineHeight = +val;
					this.style.setProperty( "--mzruiTimewindow-lineH", `${ val }px` );
					break;
				case "currenttime": {
					const step = MZRUI.$getAttributeNum( this, "currenttimestep" );

					MZRUI.$setAttribute( this.#elements.timeline, "currenttime", val );
					if ( step ) {
						this.#elements.currentTime.style.left = `${ ( val / step | 0 ) * step }em`;
					} else {
						this.#elements.currentTime.style.left = `${ val }em`;
					}
				} break;
				case "loop":
					if ( val ) {
						const [ a, b ] = val.split( "-" );

						this.classList.add( "mzruiTimewindow-looping" );
						MZRUI.$setAttribute( this.#elements.timeline, "loop", val );
						this.#elements.loopA.style.width = `${ a }em`;
						this.#elements.loopB.style.left = `${ b }em`;
					} else {
						this.classList.remove( "mzruiTimewindow-looping" );
						this.#elements.timeline.removeAttribute( "loop" );
					}
					break;
			}
		}
	}

	// .........................................................................
	#convertStepToFrac( step ) {
		return (
			step >= 1 ? "1" :
			step >= .5 ? "1 / 2" :
			step >= .25 ? "1 / 4" : "1 / 8"
		);
	}

	// .........................................................................
	#onclickStep() {
		const v = MZRUI.$getAttributeNum( this, "step" );
		const frac =
			v >= 1 ? .5 :
			v >= .5 ? .25 :
			v >= .25 ? .125 : 1;

		MZRUI.$setAttribute( this, "step", frac );
	}
	#onwheel( e ) {
		if ( e.ctrlKey ) {
			const ppb = this.#pxPerBeat;
			const min = MZRUI.$getAttributeNum( this, "pxperbeatmin" ) || 8;
			const max = MZRUI.$getAttributeNum( this, "pxperbeatmax" ) || 512;
			const offpx = parseInt( this.#elements.panel.style.minWidth );
			const mousepx = e.pageX - this.getBoundingClientRect().left - offpx;
			const scrollPpb = this.scrollLeft / ppb;
			const mul = e.deltaY > 0 ? .9 : 1.1;
			const ppbNew = Math.round( Math.min( Math.max( min, ppb * mul ), max ) );

			e.preventDefault();
			if ( ppbNew !== ppb ) {
				const scrollIncr = mousepx / ppb * ( ppbNew - ppb );

				MZRUI.$setAttribute( this, "pxperbeat", ppbNew );
				this.scrollLeft = scrollPpb * ppbNew + scrollIncr;
				MZRUI.$dispatchEvent( this, "mzruiTimewindow", "pxperbeat", ppbNew );
			}
		}
	}
	#onwheelPanel( e ) {
		if ( e.ctrlKey ) {
			const lh = this.#lineHeight;
			const min = MZRUI.$getAttributeNum( this, "lineheightmin" ) || 24;
			const max = MZRUI.$getAttributeNum( this, "lineheightmax" ) || 256;
			const offpx = parseInt( this.#elements.timeline.clientHeight );
			const mousepx = e.pageY - this.getBoundingClientRect().top - offpx;
			const scrollLh = this.scrollTop / lh;
			const mul = e.deltaY > 0 ? .9 : 1.1;
			const lhNew = Math.round( Math.min( Math.max( min, lh * mul ), max ) );

			e.preventDefault();
			if ( lhNew !== lh ) {
				const scrollIncr = mousepx / lh * ( lhNew - lh );

				MZRUI.$setAttribute( this, "lineheight", lhNew );
				this.scrollTop = scrollLh * lhNew + scrollIncr;
				MZRUI.$dispatchEvent( this, "mzruiTimewindow", "lineheight", lhNew );
			}
		}
	}
	#onmousedownExtend( panel, e ) {
		MZRUI.$unselectText();
		if ( panel === "side" ) {
			this.#panelSize = this.#elements.panel.clientWidth;
			this.#mousedownPageX = e.pageX;
			MZRUI.$dragshield.show( "ew-resize" );
			document.addEventListener( "mousemove", this.#onmousemoveExtendPanelBind );
		} else {
			this.#panelSize = this.#elements.down.clientHeight;
			this.#mousedownPageY = e.pageY;
			MZRUI.$dragshield.show( "ns-resize" );
			document.addEventListener( "mousemove", this.#onmousemoveExtendDownPanelBind );
		}
		document.addEventListener( "mouseup", this.#onmouseupExtendBind );
	}
	#onmousemoveExtendPanel( e ) {
		const w = this.#panelSize + ( e.pageX - this.#mousedownPageX );
		const min = MZRUI.$getAttributeNum( this, "panelsizemin" ) || 50;
		const max = MZRUI.$getAttributeNum( this, "panelsizemax" ) || 260;
		const w2 = Math.max( min, Math.min( w, max ) );

		this.#elements.panel.style.minWidth = `${ w2 }px`;
	}
	#onmousemoveExtendDownPanel( e ) {
		const h = this.#panelSize + ( this.#mousedownPageY - e.pageY );
		const min = MZRUI.$getAttributeNum( this, "downpanelsizemin" ) || 50;
		const max = MZRUI.$getAttributeNum( this, "downpanelsizemax" ) || 260;
		const h2 = Math.max( min, Math.min( h, max ) );

		this.#elements.panelDown.style.height =
		this.#elements.down.style.height = `${ h2 }px`;
	}
	#onmouseupExtend() {
		document.removeEventListener( "mousemove", this.#onmousemoveExtendDownPanelBind );
		document.removeEventListener( "mousemove", this.#onmousemoveExtendPanelBind );
		document.removeEventListener( "mouseup", this.#onmouseupExtendBind );
		MZRUI.$dragshield.hide();
	}
}

Object.freeze( mzruiTimewindow );
customElements.define( "mzrui-timewindow", mzruiTimewindow );
