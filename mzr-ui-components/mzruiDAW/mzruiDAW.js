"use strict";

class mzruiDAW extends HTMLElement {
	onSubmitLogin = MZRUI.$noop;
	onSubmitOpen = MZRUI.$noop;
	onExportJSON = MZRUI.$noop;
	#cmps = {
		local: new Map(),
		cloud: new Map(),
	};
	#cmpId = null;
	#cmpSaveMode = "local";
	#currentActionInd = -1;
	#actions = null;
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiDAW" );
	#children = MZRUI.$getTemplate( "mzrui-daw" );
	#timeSelecting = false;
	#elements = MZRUI.$findElements( this.#children, {
		head: ".mzruiDAW-head",
		bpm: ".mzruiDAW-tempo-bpm",
		bPM: ".mzruiDAW-tempo-beatsPerMeasure",
		sPB: ".mzruiDAW-tempo-stepsPerBeat",
		cmpName: ".mzruiDAW-currCmp-name",
		cmpSave: ".mzruiDAW-currCmp-saveBtn",
		cmpIcon: ".mzruiDAW-currCmp-localIcon",
		cmpDuration: ".mzruiDAW-currCmp-dur",
		play: "[data-action='play']",
		vers: ".mzruiDAW-version-num",
		clock: "mzrui-clock",
		spectrum: "mzrui-spectrum",
		volume: ".mzruiDAW-volume mzrui-slider",
		currentTime: ".mzruiDAW-areaTime mzrui-slider",
		userAvatar: "[data-action='profile']",
		login: "[data-action='login']",
		logout: "[data-action='logout']",
		cmpsLocalList: ".mzruiDAW-dropdown-list[data-list='local']",
		cmpsCloudList: ".mzruiDAW-dropdown-list[data-list='cloud']",
		historyList: ".mzruiDAW-history .mzruiDAW-dropdown-list",
		winBtns: {
			blocks: "[data-win='blocks']",
			mixer: "[data-win='mixer']",
			main: "[data-win='main']",
			synth: "[data-win='synth']",
			drums: "[data-win='drums']",
			piano: "[data-win='piano']",
			slicer: "[data-win='slicer']",
			effects: "[data-win='effects']",
		},
	} );
	#popups = {
		auth: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-auth" ), {
			root: ".mzruiDAW-popup-auth",
			error: ".mzruiDAW-popup-auth-error",
		} ),
		open: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-open" ), {
			root: ".mzruiDAW-popup-open",
			inputOpenURL: "[name='url']",
			inputOpenFile: "[name='file']",
		} ),
		tempo: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-tempo" ), {
			root: ".mzruiDAW-popup-tempo",
			beatsPerMeasure: "[name='beatsPerMeasure']",
			stepsPerBeat: "[name='stepsPerBeat']",
			bpm: "[name='bpm']",
			bpmTap: ".mzruiDAW-bpmTap",
		} ),
		about: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-about" ), {
			root: ".mzruiDAW-popup-about",
			version: ".mzruiDAW-popup-about-versionNum",
			versionIcon: ".mzruiDAW-popup-about-head .mzruiIcon",
			versionCheck: ".mzruiDAW-popup-about-versionCheck",
		} ),
		export: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-export" ), {
			root: ".mzruiDAW-popup-export",
			button: ".mzruiDAW-popup-export-btn",
			progress: ".mzruiDAW-popup-export-progress",
		} ),
		shortcuts: MZRUI.$getTemplate( "mzrui-daw-popup-shortcuts" ),
		cookies: MZRUI.$getTemplate( "mzrui-daw-popup-cookies" ),
		settings: MZRUI.$findElements( MZRUI.$getTemplate( "mzrui-daw-popup-settings" ), {
			root: ".mzruiDAW-popup-settings",
			sampleRate: "[name='sampleRate']",
			uiRateRadio: {
				auto: "[name='uiRate'][value='auto']",
				manual: "[name='uiRate'][value='manual']",
			},
			uiRateManualFPS: "[name='uiRate'][value='manual'] + .mzruiDAW-uiRateFps",
			uiRateManualRange: "[name='uiRateFPS']",
			windowsLowGraphics: "[name='windowsLowGraphics']",
			timelineNumbering: "[name='timelineNumbering']",
		} ),
	};

	constructor() {
		super();
		this.clock = this.#elements.clock;
		this.spectrum = this.#elements.spectrum;
		Object.seal( this );

		this.clock.onchangeDisplay = display => this.#dispatch( "changeDisplayClock", display );
		this.spectrum.setResolution( 140 );
		this.#actions = this.#elements.historyList.getElementsByClassName( "mzruiDAW-history-action" );
		this.#elements.head.onclick = this.#onclickHead.bind( this );
		this.#elements.cmpsCloudList.ondragstart = mzruiDAW.#ondragstartCmp.bind( null, "cloud" );
		this.#elements.cmpsLocalList.ondragstart = mzruiDAW.#ondragstartCmp.bind( null, "local" );
		this.#elements.cmpsCloudList.ondragover =
		this.#elements.cmpsLocalList.ondragover = e => e.preventDefault();
		this.#elements.cmpsCloudList.ondrop =
		this.#elements.cmpsLocalList.ondrop = this.#ondropCmp.bind( this );
		this.#popups.about.versionCheck.onclick = () => {
			const dt = this.#popups.about.versionIcon.dataset;

			dt.icon = "none";
			dt.spin = "on";
			fetch( `https://mozarythm.com/daw/VERSION?${ Math.random() }` )
				.then( res => res.text(), MZRUI.$noop )
				.then( res => {
					dt.spin = "";
					dt.icon = res === MZRUI.$getAttribute( this, "version" ) ? "check" : "warning";
				} );
		};
		this.#popups.tempo.bpmTap.onclick = () => this.#popups.tempo.bpm.value = gsmzrBPMTap.tap();
		this.#popups.settings.uiRateManualRange.onmousedown = () => this.#popups.settings.uiRateRadio.manual.checked = true;
		this.#popups.settings.uiRateManualRange.oninput = e => {
			this.#popups.settings.uiRateManualFPS.textContent =
				e.target.value.padStart( 2, "0" );
		};
		this.#popups.export.button.onclick = e => {
			const d = e.currentTarget.dataset;

			if ( d.status !== "2" ) {
				e.preventDefault();
			}
			if ( d.status === "0" ) {
				d.status = "1";
				this.#dispatch( "export" );
			}
		};
		MZRUI.$listenEvents( this.#elements.volume, {
			mzruiSlider: {
				input: d => this.#dispatch( "volume", d.args[ 0 ] ),
				inputStart: MZRUI.$noop,
				inputEnd: MZRUI.$noop,
				change: MZRUI.$noop,
			},
		} );
		MZRUI.$listenEvents( this.#elements.currentTime, {
			mzruiSlider: {
				inputStart: d => {
					this.#timeSelecting = true;
					this.#elements.clock.setTime( d.args[ 0 ] );
				},
				inputEnd: () => {
					this.#timeSelecting = false;
				},
				input: d => {
					this.#elements.clock.setTime( d.args[ 0 ] );
					this.#dispatch( "currentTimeLive", d.args[ 0 ] );
				},
				change: d => {
					this.#dispatch( "currentTime", d.args[ 0 ] );
				},
			},
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( this.#children ) {
			this.append( ...this.#children );
			this.#children = null;
			MZRUI.$recallAttributes( this, {
				saved: true,
				uirate: "auto",
				timelinenumbering: 0,
				bpm: 60,
				name: "",
				duration: 10,
				timedivision: "1/1",
				currenttime: 0,
				maxtime: 1,
				volume: 1,
				version: "0.0.0",
			} );
		}
	}
	static get observedAttributes() {
		return [
			"bpm",
			"currentcomposition",
			"currenttime",
			"duration",
			"errauth",
			"exporting",
			"logging",
			"maxtime",
			"name",
			"playing",
			"saving",
			"timedivision",
			"timelinenumbering",
			"useravatar",
			"username",
			"version",
			"volume",
		];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( !this.#children && prev !== val ) {
			switch ( prop ) {
				case "currentcomposition":
					val
						? this.#loadComposition( ...val.split( ":" ) )
						: this.#unloadComposition();
					break;
				case "errauth":
					this.#popups.auth.error.textContent = val;
					break;
				case "exporting":
					this.#popups.export.progress.value = val;
					break;
				case "logging":
					this.#elements.login.dataset.spin =
					this.#elements.logout.dataset.spin = val !== null ? "on" : "";
					break;
				case "username":
					MZRUI.$setAttribute( this.#elements.userAvatar, "href",
						val && `https://mozarythm.com/#/u/${ val }` );
					break;
				case "name":
					this.#elements.cmpName.textContent = val;
					break;
				case "playing":
					this.#elements.play.dataset.icon = val !== null ? "pause" : "play";
					break;
				case "saving":
					this.#cmps[ this.#cmpSaveMode ].get( this.#cmpId ).save.dataset.spin =
					this.#elements.cmpSave.dataset.spin = val !== null ? "on" : "";
					break;
				case "duration":
					this.#updateDuration();
					break;
				case "timelinenumbering":
					mzruiClock.numbering( val );
					break;
				case "bpm":
					MZRUI.$setAttribute( this.#elements.clock, "bpm", val );
					this.#elements.bpm.textContent = val;
					this.#updateDuration();
					break;
				case "timedivision":
					MZRUI.$setAttribute( this.#elements.clock, "timedivision", val );
					this.#elements.bPM.textContent = val.split( "/" )[ 0 ];
					this.#elements.sPB.textContent = val.split( "/" )[ 1 ];
					break;
				case "volume":
					this.#elements.volume.setValue( val );
					break;
				case "currenttime":
					if ( !this.#timeSelecting ) {
						this.#elements.clock.setTime( val );
						this.#elements.currentTime.setValue( val );
					}
					break;
				case "maxtime":
					MZRUI.$setAttribute( this.#elements.currentTime, "max", val );
					break;
				case "useravatar":
					this.#elements.userAvatar.style.backgroundImage = val ? `url("${ val }")` : "";
					break;
				case "version":
					this.#elements.vers.textContent = val;
					this.#popups.about.version.textContent = val;
					break;
			}
		}
	}

	// .........................................................................
	updateSpectrum( data ) {
		this.#elements.spectrum.draw( data );
	}
	#unloadComposition() {
		this.#cmpId = null;
		this.#cmpSaveMode = "local";
		this.querySelector( ".mzruiDAW-cmp-loaded" )?.classList?.remove( "mzruiDAW-cmp-loaded" );
	}
	#loadComposition( saveMode, id ) {
		const html = this.#cmps[ saveMode ].get( id );

		this.#unloadComposition();
		if ( html ) {
			this.#cmpId = id;
			this.#cmpSaveMode = saveMode;
			html.root.classList.add( "mzruiDAW-cmp-loaded" );
			html.root.parentNode.prepend( html.root );
			html.root.parentNode.scrollTop = 0;
			MZRUI.$setAttribute( this.#elements.cmpIcon, "data-icon", saveMode === "local" ? "local" : "cloud" );
			MZRUI.$setAttribute( this.#elements.cmpSave, "data-icon", saveMode === "local" ? "save" : "upload" );
		}
	}
	#updateDuration() {
		const dur = MZRUI.$getAttributeNum( this, "duration" );
		const [ min, sec ] = mzruiClock.parseBeatsToSeconds( dur, MZRUI.$getAttributeNum( this, "bpm" ) );

		this.#elements.cmpDuration.textContent = `${ min }:${ sec }`;
		MZRUI.$setAttribute( this.#elements.currentTime, "max", dur );
	}

	// .........................................................................
	showOpenPopup() {
		this.#popups.open.inputOpenFile.value =
		this.#popups.open.inputOpenURL.value = "";
		MZRUI.$popup.custom( {
			title: "Open",
			element: this.#popups.open.root,
			submit: obj => this.onSubmitOpen( obj.url, obj.file ),
		} );
	}
	clearCompositions() {
		this.#cmps.local.forEach( html => html.root.remove() );
		this.#cmps.cloud.forEach( html => html.root.remove() );
	}
	addComposition( cmp ) {
		const saveMode = cmp.options.saveMode;

		if (
			( saveMode === "local" && this.#cmps.local.has( cmp.id ) ) ||
			( saveMode === "cloud" && this.#cmps.cloud.has( cmp.id ) )
		) {
			this.updateComposition( cmp );
		} else {
			const root = MZRUI.$getTemplate( "mzrui-daw-cmp", { id: cmp.id, saveMode } );
			const html = MZRUI.$findElements( root, {
				root: ".mzruiDAW-cmp",
				bpm: ".mzruiDAW-cmp-bpm",
				name: ".mzruiDAW-cmp-name",
				save: "[data-action='cmp-save']",
				duration: ".mzruiDAW-cmp-duration",
			} );

			this.#cmps[ saveMode ].set( cmp.id, html );
			this.updateComposition( cmp );
			( saveMode === "local"
				? this.#elements.cmpsLocalList
				: this.#elements.cmpsCloudList ).append( root );
			if ( `${ saveMode }:${ cmp.id }` === MZRUI.$getAttribute( this, "currentcomposition" ) ) {
				this.#loadComposition( saveMode, cmp.id );
			}
		}
	}
	updateComposition( cmp ) {
		const html = this.#cmps[ cmp.options.saveMode ].get( cmp.id );
		const [ min, sec ] = mzruiClock.parseBeatsToSeconds( cmp.duration, cmp.bpm );

		html.bpm.textContent = cmp.bpm;
		html.name.textContent = cmp.name;
		html.duration.textContent = `${ min }:${ sec }`;
	}
	deleteComposition( cmp ) {
		const cmps = this.#cmps[ cmp.options.saveMode ];
		const html = cmps.get( cmp.id );

		if ( html ) {
			html.root.remove();
			cmps.delete( cmp.id );
		}
	}
	readyToDownload( url, name ) {
		MZRUI.$setAttribute( this.#popups.export.button, "href", url );
		MZRUI.$setAttribute( this.#popups.export.button, "download", name );
		MZRUI.$setAttribute( this.#popups.export.button, "data-status", 2 );
	}
	static #ondragstartCmp( saveMode, e ) {
		const elCmp = e.target.closest( ".mzruiDAW-cmp" );

		e.dataTransfer.setData( "text/plain", `${ saveMode }:${ elCmp.dataset.id }` );
	}
	#ondropCmp( e ) {
		const [ saveMode, id ] = e.dataTransfer.getData( "text/plain" ).split( ":" );

		if ( saveMode !== e.currentTarget.dataset.list ) {
			this.#dispatch( "switchCompositionLocation", saveMode, id );
		}
	}

	// .........................................................................
	toggleWindow( win, b ) {
		MZRUI.$setAttribute( this.#elements.winBtns[ win ], "data-open", b );
	}
	clearHistory() {
		Array.from( this.#actions ).forEach( a => a.remove() );
		this.#currentActionInd = -1;
	}
	stackAction( icon, desc ) {
		Array.from( this.#actions ).forEach( a => "undone" in a.dataset && a.remove() );
		this.#elements.historyList.append( MZRUI.$getTemplate( "mzrui-daw-history-action", { icon, desc, index: this.#actions.length } ) );
		this.#elements.historyList.scroll( 0, Number.MAX_SAFE_INTEGER );
		this.#currentActionInd = this.#actions.length - 1;
	}
	undo() {
		if ( this.#currentActionInd >= 0 ) {
			MZRUI.$setAttribute( this.#actions[ this.#currentActionInd-- ], "data-undone", true );
		}
	}
	redo() {
		if ( this.#currentActionInd < this.#actions.length - 1 ) {
			MZRUI.$setAttribute( this.#actions[ ++this.#currentActionInd ], "data-undone", false );
		}
	}

	// .........................................................................
	#onclickHead( e ) {
		const dt = e.target.dataset;

		switch ( dt.action ) {
			case "logout":
			case "localNewCmp":
			case "cloudNewCmp":
			case "focusSwitch":
			case "play":
			case "stop":
			case "reset":
			case "undo":
			case "redo":
				this.#dispatch( dt.action );
				break;
			case "cmp-save":
				this.#dispatch( "save" );
				break;
			case "cmp-open":
				e.preventDefault();
				this.#dispatch( "open",
					this.#elements.cmpsLocalList.contains( e.target.parentNode ) ? "local" : "cloud",
					e.target.parentNode.dataset.id );
				break;
			case "cmp-json": {
				const json = this.onExportJSON(
					this.#elements.cmpsLocalList.contains( e.target.parentNode ) ? "local" : "cloud",
					e.target.parentNode.dataset.id );

				if ( json ) {
					MZRUI.$setAttribute( e.target, "href", json.url );
					MZRUI.$setAttribute( e.target, "download", json.name );
				} else {
					e.preventDefault();
				}
			} break;
			case "cmp-delete":
				this.#dispatch( "delete",
					this.#elements.cmpsLocalList.contains( e.target.parentNode ) ? "local" : "cloud",
					e.target.parentNode.dataset.id );
				break;
			case "cmp-rename":
				MZRUI.$popup.prompt( "Composition's title", "", MZRUI.$getAttribute( this, "name" ), "Rename" )
					.then( n => n && n !== MZRUI.$getAttribute( this, "name" ) && this.#dispatch( "rename", n ) );
				break;
			case "login":
				MZRUI.$popup.custom( {
					ok: "Sign in",
					title: "Authentication",
					element: this.#popups.auth.root,
					submit: obj => this.onSubmitLogin( obj.email, obj.password ),
				} ).then( () => {
					this.#popups.auth.root.querySelectorAll( "input" ).forEach( inp => inp.value = "" );
				} );
				break;
			case "localOpenCmp":
				this.showOpenPopup();
				break;
			case "window":
				this.#dispatch( dt.open === undefined ? "openWindow" : "closeWindow", dt.win );
				break;
			case "historyAction":
				if ( dt.index - this.#currentActionInd ) {
					this.#dispatch( "redoN", dt.index - this.#currentActionInd );
				}
				break;
			case "cookies":
				MZRUI.$popup.custom( { title: "Cookies consent", element: this.#popups.cookies } )
					.then( arg => arg !== undefined && this.#dispatch( "oki-cookies" ) );
				break;
			case "about":
				MZRUI.$popup.custom( { title: "About", element: this.#popups.about.root } );
				break;
			case "export":
				MZRUI.$setAttribute( this, "exporting", 0 );
				MZRUI.$setAttribute( this.#popups.export.button, "href", "" );
				MZRUI.$setAttribute( this.#popups.export.button, "download", "" );
				MZRUI.$setAttribute( this.#popups.export.button, "data-status", 0 );
				MZRUI.$popup.custom( { title: "Export", element: this.#popups.export.root } )
					.then( () => this.#dispatch( "abortExport" ) );
				break;
			case "shortcuts":
				MZRUI.$popup.custom( { title: "Keyboard / mouse shortcuts", element: this.#popups.shortcuts } );
				break;
			case "tempo":
				this.#popups.tempo.beatsPerMeasure.value = +MZRUI.$getAttribute( this, "timedivision" ).split( "/" )[ 0 ];
				this.#popups.tempo.stepsPerBeat.value = +MZRUI.$getAttribute( this, "timedivision" ).split( "/" )[ 1 ];
				this.#popups.tempo.bpm.value = MZRUI.$getAttributeNum( this, "bpm" );
				MZRUI.$popup.custom( { title: "Tempo", element: this.#popups.tempo.root } )
					.then( data => {
						if ( data ) {
							const newTimediv = `${ data.beatsPerMeasure }/${ data.stepsPerBeat }`;

							if (
								newTimediv !== MZRUI.$getAttribute( this, "timedivision" ) ||
								data.bpm !== MZRUI.$getAttributeNum( this, "bpm" )
							) {
								this.#dispatch( "tempo", data );
							}
						}
					} );
				break;
			case "settings":
				this.#popups.settings.sampleRate.value = MZRUI.$getAttributeNum( this, "samplerate" );
				this.#popups.settings.timelineNumbering.value = MZRUI.$getAttributeNum( this, "timelinenumbering" );
				this.#popups.settings.windowsLowGraphics.checked = MZRUI.$getAttribute( this, "windowslowgraphics" ) === "";
				this.#popups.settings.uiRateRadio[ MZRUI.$getAttribute( this, "uirate" ) === "auto" ? "auto" : "manual" ].checked = true;
				if ( MZRUI.$getAttribute( this, "uirate" ) !== "auto" ) {
					this.#popups.settings.uiRateManualFPS.textContent = MZRUI.$getAttribute( this, "uirate" ).padStart( 2, "0" );
					this.#popups.settings.uiRateManualRange.value = MZRUI.$getAttribute( this, "uirate" );
				}
				MZRUI.$popup.custom( { title: "Settings", element: this.#popups.settings.root } )
					.then( data => {
						if ( data ) {
							if ( data.uiRate === "manual" ) {
								data.uiRate = data.uiRateFPS;
							}
							delete data.uiRateFPS;
							if (
								(
									data.uiRate !== MZRUI.$getAttribute( this, "uirate" ) &&
									data.uiRate !== MZRUI.$getAttributeNum( this, "uirate" )
								) ||
								data.sampleRate !== MZRUI.$getAttributeNum( this, "samplerate" ) ||
								data.timelineNumbering !== MZRUI.$getAttributeNum( this, "timelinenumbering" ) ||
								data.windowsLowGraphics !== ( MZRUI.$getAttribute( this, "windowslowgraphics" ) === "" )
							) {
								this.#dispatch( "settings", data );
							}
						}
					} );
				break;
			case "cmps":
			case "help":
			case "undoMore":
			case "changelog":
				break;
			default:
				dt.action && console.log( "untracked action:", dt.action );
				break;
		}
	}
}

Object.seal( mzruiDAW );
customElements.define( "mzrui-daw", mzruiDAW );
