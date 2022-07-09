"use strict";

class MZRDAW {
	#dawcore = new DAWCore();
	#synth = new MZRSynth();
	#drums = new MZRDrums();
	#mixer = new MZRMixer();
	#slicer = new MZRSlicer();
	#effects = new MZREffects();
	#patterns = new MZRPatterns();
	#pianoroll = new MZRPianoroll();
	#patternroll = new MZRPatternroll();
	#windows = MZRUI.$createElement( "mzrui-windows" );
	rootElement = MZRUI.$createElement( "mzrui-daw", {
		"oki-cookies": document.cookie.indexOf( "cookieAccepted" ) > -1,
		version: "0.0.0",
		volume: this.#dawcore.$getAudioDestinationGain(),
		uirate: +localStorage.getItem( "uiRefreshRate" ) || "auto",
		samplerate: this.#dawcore.env.sampleRate,
		timelinenumbering: localStorage.getItem( "uiTimeNumbering" ) || "1",
		windowslowgraphics: !!+( localStorage.getItem( "mzruiWindows.lowGraphics" ) || "0" ),
	} );
	#elements = null;
	#keyboardFns = [
		[ true,  false, "o", () => this.rootElement.showOpenPopup() ],
		[ true,  false, "s", () => this.#oncmpClickSave() ],
		[ true,  true,  "n", () => this.#oncmpClickNewLocal() ],
		[ true,  false, "z", () => this.#dawcore.historyUndo() ],
		[ true,  false, "Z", () => this.#dawcore.historyRedo() ],
		[ false, false, " ", () => this.#dawcore.isPlaying() ? this.#dawcore.stop() : this.#dawcore.play() ],
	];
	static #dropExtensions = { gs: true, txt: true, json: true };

	constructor() {
		Object.seal( this );
		this.#initHTML();
		this.#initWindowsHTML();
		this.#initWindows();
		this.#initComponents();
		this.#initEvents();
		this.#authGetMe();
	}

	// .........................................................................
	#initHTML() {
		document.body.append(
			this.rootElement,
			MZRUI.$getTemplate( "mzrui-daw-window-main" ),
			MZRUI.$getTemplate( "mzrui-daw-window-piano" ),
			MZRUI.$getTemplate( "mzrui-daw-window-drums" ),
			MZRUI.$getTemplate( "mzrui-daw-window-synth" ),
			MZRUI.$getTemplate( "mzrui-daw-window-mixer" ),
			MZRUI.$getTemplate( "mzrui-daw-window-slicer" ),
			MZRUI.$getTemplate( "mzrui-daw-window-effects" ),
		);
		this.rootElement.querySelector( ".mzruiDAW-windows" ).append( this.#windows );
		this.#dawcore.setLoopRate( +localStorage.getItem( "uiRefreshRate" ) || 60 );
		this.#windows.lowGraphics( !!+( localStorage.getItem( "mzruiWindows.lowGraphics" ) || "0" ) );
		MZRUI.$setAttribute( this.rootElement.clock, "mode", localStorage.getItem( "mzruiClock.display" ) || "second" );
		mzruiClock.numbering( localStorage.getItem( "uiTimeNumbering" ) || "1" );
		mzruiTimeline.numbering( localStorage.getItem( "uiTimeNumbering" ) || "1" );
		this.#elements = MZRUI.$findElements( document.body, {
			drumsName: "[data-target=drums]",
			synthName: "[data-target=synth]",
			slicesName: "[data-target=slices]",
			channelName: "[data-target=channel]",
			pianorollName: "[data-target=pianoroll]",
			synthChannelBtn: "[data-target=synthChannel]",
			synthChannelBtnText: "[data-target=synthChannel] span",
		} );
	}
	#initComponents() {
		this.#drums.setDAWCore( this.#dawcore );
		this.#mixer.setDAWCore( this.#dawcore );
		this.#synth.setDAWCore( this.#dawcore );
		this.#slicer.setDAWCore( this.#dawcore );
		this.#effects.setDAWCore( this.#dawcore );
		this.#patterns.setDAWCore( this.#dawcore );
		this.#pianoroll.setDAWCore( this.#dawcore );
		this.#patternroll.setDAWCore( this.#dawcore );
		this.rootElement.querySelector( ".mzruiDAW-patterns" ).append( this.#patterns.rootElement );
		this.#windows.window( "main" ).contentAppend( this.#patternroll.rootElement );
		this.#windows.window( "drums" ).contentAppend( this.#drums.rootElement );
		this.#windows.window( "mixer" ).contentAppend( this.#mixer.rootElement );
		this.#windows.window( "piano" ).contentAppend( this.#pianoroll.rootElement );
		this.#windows.window( "slicer" ).contentAppend( this.#slicer.rootElement );
		this.#windows.window( "effects" ).contentAppend( this.#effects.rootElement );
		this.#drums.rootElement.onfocus = () => this.#dawcore.focusOn( "drums" );
		this.#slicer.rootElement.onfocus = () => this.#dawcore.focusOn( "slices" );
		this.#pianoroll.rootElement.onfocus = () => this.#dawcore.focusOn( "keys" );
		this.#patternroll.rootElement.onfocus = () => this.#dawcore.focusOn( "composition" );
		this.#windows.window( "main" ).onfocusin = GSDAW.#onfocusin.bind( null, this.#patternroll );
		this.#windows.window( "drums" ).onfocusin = GSDAW.#onfocusin.bind( null, this.#drums );
		this.#windows.window( "piano" ).onfocusin = GSDAW.#onfocusin.bind( null, this.#pianoroll );
		this.#windows.window( "slicer" ).onfocusin = GSDAW.#onfocusin.bind( null, this.#slicer );
		this.#elements.synthName.onclick = this.#onclickName.bind( this, "Rename synthesizer", "renameSynth", "synth" );
		this.#elements.drumsName.onclick = this.#onclickName.bind( this, "Rename pattern", "renamePattern", "drums" );
		this.#elements.slicesName.onclick = this.#onclickName.bind( this, "Rename pattern", "renamePattern", "slices" );
		this.#elements.pianorollName.onclick = this.#onclickName.bind( this, "Rename pattern", "renamePattern", "keys" );
		this.#elements.channelName.onclick = this.#onclickName.bind( this, "Rename channel", "renameChannel", "channels" );
		this.#elements.synthChannelBtn.onclick = this.#onclickSynthChannel.bind( this );
		this.#mixer.onselectChan = id => this.#selectChannel( id );
		this.#patternroll.setSVGForms( this.#patterns.svgForms );
		this.#pianoroll.rootElement.octaves( 1, 7 );
		this.#drums.rootElement.setPxPerBeat( 120 );
		this.#drums.setWaveforms( this.#patterns.svgForms.bufferHD );
		this.#windows.window( "main" ).open();
		this.#windows.window( "mixer" ).open();
		this.#synth.loadWaves().then( () => this.#windows.window( "synth" ).contentAppend( this.#synth.rootElement ) );
	}
	#initEvents() {
		window.onblur = () => this.#pianoroll.getUIKeys().midiReleaseAllKeys();
		window.onkeyup = this.#onkeyup.bind( this );
		window.onkeydown = this.#onkeydown.bind( this );
		window.onbeforeunload = this.#oncmpBeforeUnload.bind( this );
		this.rootElement.ondragover = () => false;
		this.rootElement.oncontextmenu = () => location.host === "localhost" ? undefined : false;
		this.rootElement.addEventListener( "wheel", GSDAW.#onwheel, { passive: false } );
		this.rootElement.addEventListener( "drop", this.#ondrop.bind( this ) );

		this.#dawcore.cb.focusOn = this.#oncontrolsFocus.bind( this );
		this.#dawcore.cb.currentTime = ( beat, focused ) => {
			MZRUI.$setAttribute( this.#controlsGetFocusedGrid( focused ), "currenttime", beat );
			MZRUI.$setAttribute( this.rootElement, "currenttime", beat );
		};
		this.#dawcore.cb.buffersLoaded = this.#onpatternsBuffersLoaded.bind( this );
		this.#dawcore.cb.compositionAdded = cmp => this.rootElement.addComposition( cmp );
		this.#dawcore.cb.compositionOpened = cmp => {
			MZRUI.$setAttribute( this.rootElement, "currentcomposition", `${ cmp.options.saveMode }:${ cmp.id }` );
			this.#patterns.rootElement.expandSynth( cmp.synthOpened, true );
			this.#selectChannel( "main" );
			this.#setTitle( cmp.name );
		};
		this.#dawcore.cb.compositionClosed = this.#oncmpClosed.bind( this );
		this.#dawcore.cb.compositionChanged = this.#oncmpChanged.bind( this );
		this.#dawcore.cb.compositionDeleted = cmp => this.rootElement.deleteComposition( cmp );
		this.#dawcore.cb.compositionLoading = ( cmp, loading ) => MZRUI.$setAttribute( this.rootElement, "saving", loading );
		this.#dawcore.cb.compositionSavedStatus = ( cmp, saved ) => {
			MZRUI.$setAttribute( this.rootElement, "saved", saved );
			this.#setTitle( cmp.name );
		};
		this.#dawcore.cb.compositionSavingPromise = this.#authSaveComposition.bind( this );
		this.#dawcore.cb.historyUndo = () => this.rootElement.undo();
		this.#dawcore.cb.historyRedo = () => this.rootElement.redo();
		this.#dawcore.cb.historyAddAction = act => this.rootElement.stackAction( act.icon, act.desc );
		this.#dawcore.cb.onstartdrum = rowId => this.#drums.onstartdrum( rowId );
		this.#dawcore.cb.onstopdrumrow = rowId => this.#drums.onstopdrumrow( rowId );
		this.#dawcore.cb.analyserFilled = data => this.rootElement.updateSpectrum( data );
		this.#dawcore.cb.channelAnalyserFilled = ( chanId, ldata, rdata ) => this.#mixer.updateAudioData( chanId, ldata, rdata );
		this.#dawcore.cb.pause =
		this.#dawcore.cb.stop = () => MZRUI.$setAttribute( this.rootElement, "playing", false );
		this.#dawcore.cb.play = () => MZRUI.$setAttribute( this.rootElement, "playing", true );

		this.rootElement.onSubmitLogin = ( email, pass ) => {
			MZRUI.$setAttribute( this.rootElement, "logging", true );
			MZRUI.$setAttribute( this.rootElement, "errauth", false );
			return mzrapiClient.login( email, pass )
				.then( me => {
					this.#authLoginThen( me );
					return mzrapiClient.getUserCompositions( me.id );
				} )
				.then( cmps => {
					const opt = { saveMode: "cloud" };

					cmps.forEach( cmp => this.#dawcore.addCompositionByJSObject( cmp.data, opt ) );
				} )
				.catch( res => {
					MZRUI.$setAttribute( this.rootElement, "errauth", res.msg );
					throw res;
				} )
				.finally( () => MZRUI.$setAttribute( this.rootElement, "logging", false ) );
		};
		this.rootElement.onSubmitOpen = ( url, file ) => {
			if ( url || file[ 0 ] ) {
				return ( url
					? this.#dawcore.addCompositionByURL( url )
					: this.#dawcore.addCompositionByBlob( file[ 0 ] )
				).then( cmp => this.#dawcore.openComposition( "local", cmp.id ) );
			}
		};
		this.rootElement.onExportJSON = ( saveMode, id ) => this.#dawcore.compositionExportJSON( saveMode, id );

		MZRUI.$listenEvents( this.rootElement, {
			mzruiDAW: {
				"oki-cookies": () => {
					document.cookie = "cookieAccepted";
					MZRUI.$setAttribute( this.rootElement, "oki-cookies", "" );
				},
				switchCompositionLocation: d => {
					const [ saveMode, id ] = d.args;

					saveMode === "local"
						? this.#oncmpCloudDrop( saveMode, id )
						: this.#oncmpLocalDrop( saveMode, id );
				},
				settings: d => {
					const data = d.args[ 0 ];

					this.#dawcore.setLoopRate( data.uiRate === "auto" ? 60 : data.uiRate );
					this.#dawcore.setSampleRate( data.sampleRate );
					this.#windows.lowGraphics( data.windowsLowGraphics );
					mzruiClock.numbering( data.timelineNumbering );
					mzruiTimeline.numbering( data.timelineNumbering );
					localStorage.setItem( "uiRefreshRate", data.uiRate );
					localStorage.setItem( "mzruiWindows.lowGraphics", +data.windowsLowGraphics );
					localStorage.setItem( "uiTimeNumbering", data.timelineNumbering );
					MZRUI.$setAttribute( this.rootElement, "uirate", data.uiRate );
					MZRUI.$setAttribute( this.rootElement, "samplerate", data.sampleRate );
					MZRUI.$setAttribute( this.rootElement, "timelinenumbering", data.timelineNumbering );
					MZRUI.$setAttribute( this.rootElement, "windowslowgraphics", data.windowsLowGraphics );
				},
				changeDisplayClock( d ) {
					const display = d.args[ 0 ];

					localStorage.setItem( "mzruiClock.display", display );
				},
				export: () => {
					const dur = this.#dawcore.$getDuration() * 60 / this.#dawcore.$getBPM();
					const intervalId = setInterval( () => {
						MZRUI.$setAttribute( this.rootElement, "exporting", this.#dawcore.ctx.currentTime / dur );
					}, 100 );

					this.#dawcore.compositionExportWAV().then( obj => {
						clearInterval( intervalId );
						MZRUI.$setAttribute( this.rootElement, "exporting", 1 );
						this.rootElement.readyToDownload( obj.url, obj.name );
					} );
				},
				abortExport: () => this.#dawcore.compositionAbortWAV(),
				save: () => this.#oncmpClickSave(),
				open: d => this.#oncmpClickOpen( ...d.args ),
				delete: d => this.#oncmpClickDelete( ...d.args ),
				tempo: d => {
					const o = d.args[ 0 ];

					this.#dawcore.callAction( "changeTempo", o.bpm, o.beatsPerMeasure, o.stepsPerBeat );
				},
				logout: () => {
					MZRUI.$setAttribute( this.rootElement, "logging", true );
					mzrapiClient.logout()
						.finally( () => MZRUI.$setAttribute( this.rootElement, "logging", false ) )
						.then( () => {
							MZRUI.$setAttribute( this.rootElement, "logged", false );
							MZRUI.$setAttribute( this.rootElement, "useravatar", false );
							MZRUI.$setAttribute( this.rootElement, "username", false );
							this.#dawcore.$getCompositions( "cloud" )
								.forEach( cmp => this.#dawcore.deleteComposition( "cloud", cmp.id ) );
							if ( !this.#dawcore.$getCmp() ) {
								this.#oncmpClickNewLocal();
							}
						} );
				},
				localNewCmp: () => this.#oncmpClickNewLocal(),
				cloudNewCmp: () => this.#oncmpClickNewCloud(),
				openWindow: d => this.#windows.window( d.args[ 0 ] ).open(),
				closeWindow: d => this.#windows.window( d.args[ 0 ] ).close(),
				focusSwitch: () => this.#dawcore.focusSwitch(),
				volume: d => this.#dawcore.destinationSetGain( d.args[ 0 ] ),
				rename: d => this.#dawcore.callAction( "renameComposition", d.args[ 0 ] ),
				currentTimeLive: d => MZRUI.$setAttribute( this.#controlsGetFocusedGrid().timeline, "currenttime-preview", d.args[ 0 ] ),
				currentTime: d => {
					const timeline = this.#controlsGetFocusedGrid().timeline;
					const tpreview = MZRUI.$getAttribute( timeline, "currenttime-preview" );

					MZRUI.$setAttribute( timeline, "currenttime-preview", null );
					this.#dawcore.setCurrentTime( +( tpreview || d.args[ 0 ] ) );
				},
				play: () => this.#dawcore.togglePlay(),
				stop: () => {
					this.#dawcore.stop();
					switch ( document.activeElement ) {
						case this.#pianoroll.rootElement: this.#dawcore.focusOn( "keys", "-f" ); break;
						case this.#drums.rootElement: this.#dawcore.focusOn( "drums", "-f" ); break;
						case this.#slicer.rootElement: this.#dawcore.focusOn( "slices", "-f" ); break;
						case this.#patternroll.rootElement: this.#dawcore.focusOn( "composition", "-f" ); break;
					}
				},
				reset: () => this.#dawcore.resetAudioContext(),
				undo: () => this.#dawcore.historyUndo(),
				redo: () => this.#dawcore.historyRedo(),
				redoN: d => {
					let n = d.args[ 0 ];

					if ( n < 0 ) {
						while ( n++ < 0 ) {
							this.#dawcore.historyUndo();
						}
					} else {
						while ( n-- > 0 ) {
							this.#dawcore.historyRedo();
						}
					}
				},
			},
		} );
	}
	#initWindows() {
		this.#windows.onopen = win => this.rootElement.toggleWindow( win.dataset.id, true );
		this.#windows.onclose = win => {
			this.rootElement.toggleWindow( win.dataset.id, false );
			switch ( win.dataset.id ) {
				case "piano": this.#dawcore.callAction( "closePattern", "keys" ); break;
				case "drums": this.#dawcore.callAction( "closePattern", "drums" ); break;
				case "slicer": this.#dawcore.callAction( "closePattern", "slices" ); break;
			}
		};
		this.#initWindowsPos( "mixer",    20,  20, 266, 200, 400, 300, "mixer",       "mixer" );
		this.#initWindowsPos( "main",    440,  20, 380, 180, 600, 360, "music",       "composition" );
		this.#initWindowsPos( "synth",    20, 340, 340, 220, 400, 460, "oscillator",  "synth" );
		this.#initWindowsPos( "piano",   440, 400, 380, 180, 600, 400, "keys",        "pianoroll" );
		this.#initWindowsPos( "drums",    70, 450, 380, 180, 900, 400, "drums",       "drums" );
		this.#initWindowsPos( "slicer",  160, 140, 306, 250, 420, 360, "slices",      "slicer" );
		this.#initWindowsPos( "effects", 140, 120, 230, 180, 420, 360, "effects",     "effects" );
	}
	#initWindowsPos( winId, x, y, wmin, hmin, w, h, icon, title ) {
		const win = this.#windows.window( winId );

		win.setSize( w, h );
		win.setMinSize( wmin, hmin );
		win.setTitle( title );
		win.setPosition( x, y );
		win.setTitleIcon( icon );
	}
	#initWindowsHTML() {
		document.querySelectorAll( "div[data-window]" ).forEach( winCnt => {
			const win = this.#windows.createWindow( winCnt.dataset.window );
			const elWinCnt = win.querySelector( ".mzruiWindow-content" );
			const children = Array.from( winCnt.children );

			winCnt.remove();
			winCnt.classList.forEach( c => elWinCnt.classList.add( c ) );
			if ( children.length ) {
				const child0 = children[ 0 ];

				if ( child0.classList.contains( "mzruiDAW-winMenu" ) ) {
					children.shift();
					win.headAppend( ...child0.children );
				}
				win.contentAppend( ...children );
			}
		} );
	}

	// .........................................................................
	getDAWCore() { return this.#dawcore; }
	newComposition() { this.#oncmpClickNewLocal(); }

	// .........................................................................
	#oncontrolsFocus( focStr ) {
		const beat = this.#dawcore.getCurrentTime();
		const grid = this.#controlsGetFocusedGrid( focStr );
		const onCmp = focStr === "composition";

		MZRUI.$setAttribute( this.rootElement, "focus", onCmp ? "up" : "down" );
		MZRUI.$setAttribute( this.rootElement, "duration", this.#dawcore.getFocusedDuration() );
		MZRUI.$setAttribute( this.rootElement, "currenttime", beat );
		this.#pianoroll.rootElement.classList.toggle( "selected", focStr === "keys" );
		this.#drums.rootElement.classList.toggle( "selected", focStr === "drums" );
		this.#slicer.rootElement.classList.toggle( "selected", focStr === "slices" );
		this.#patternroll.rootElement.classList.toggle( "selected", onCmp );
		grid.focus();
	}
	#controlsGetFocusedGrid( focStr = this.#dawcore.getFocusedName() ) {
		switch ( focStr ) {
			default: return null;
			case "keys": return this.#pianoroll.rootElement;
			case "drums": return this.#drums.rootElement;
			case "slices": return this.#slicer.rootElement;
			case "composition": return this.#patternroll.rootElement;
		}
	}
	#onkeydown( e ) {
		if ( !this.#isKeyboardShortcuts( e ) && !e.ctrlKey && !e.altKey && !e.shiftKey ) {
			this.#pianorollKeyboardEvent( true, e );
		}
	}
	#onkeyup( e ) {
		this.#pianorollKeyboardEvent( false, e );
	}
	#pianorollKeyboardEvent( status, e ) {
		const uiKeys = this.#pianoroll.getUIKeys();
		const midi = uiKeys.getMidiKeyFromKeyboard( e );

		if ( midi !== false ) {
			status
				? uiKeys.midiKeyDown( midi )
				: uiKeys.midiKeyUp( midi );
			return true;
		}
	}
	#isKeyboardShortcuts( e ) {
		return this.#keyboardFns.some( ( [ ctrlOrAlt, alt, key, fn ] ) => {
			if ( ( key === e.key ) &&
				( !alt || e.altKey ) &&
				( ctrlOrAlt === ( e.ctrlKey || e.altKey ) )
			) {
				fn();
				e.preventDefault();
				return true;
			}
		} );
	}
	#oncmpClickSave() {
		if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
			this.#dawcore.saveComposition();
		} else {
			MZRUI.$popup.alert( "Error", "You have to accept our cookies before saving locally your composition." );
		}
	}
	#oncmpClickNewLocal() {
		( !this.#dawcore.compositionNeedSave()
			? this.#dawcore.newComposition()
			: MZRUI.$popup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
				.then( b => b && this.#dawcore.newComposition() )
		).then( cmp => cmp && this.#dawcore.openComposition( "local", cmp.id ) );
	}
	#oncmpClickNewCloud() {
		if ( !mzrapiClient.user.id ) {
			MZRUI.$popup.alert( "Error",
				"You can not create a new composition in the <b>cloud</b><br/>without being connected" );
		} else {
			( !this.#dawcore.compositionNeedSave()
				? this.#dawcore.newComposition( { saveMode: "cloud" } )
				: MZRUI.$popup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
					.then( b => b && this.#dawcore.newComposition( { saveMode: "cloud" } ) )
			).then( cmp => cmp && this.#dawcore.openComposition( "cloud", cmp.id ) );
		}
	}
	#oncmpBeforeUnload() {
		if ( this.#dawcore.compositionNeedSave() ) {
			return "Data unsaved";
		}
	}
	#oncmpClickOpen( saveMode, id ) {
		if ( this.#dawcore.compositionNeedSave() ) {
			MZRUI.$popup.confirm( "Warning",
				"Are you sure you want to discard unsaved works"
			).then( ok => ok && this.#dawcore.openComposition( saveMode, id ) );
		} else {
			this.#dawcore.openComposition( saveMode, id );
		}
	}
	#oncmpClickDelete( saveMode, id ) {
		const cmp = this.#dawcore.$getComposition( saveMode, id );

		MZRUI.$popup.confirm( "Warning",
			`Are you sure you want to delete "${ cmp.name }" ? (no undo possible)`,
			"Delete"
		).then( b => {
			if ( b ) {
				( saveMode === "cloud"
					? mzrapiClient.deleteComposition( id )
					: Promise.resolve() )
					.catch( err => {
						if ( err.code !== 404 ) {
							MZRUI.$popup.alert( `Error ${ err.code }`,
								"An error happened while deleting " +
								"your composition&nbsp;:<br/>" +
								`<code>${ err.msg || err }</code>` );
							throw err;
						}
					} )
					.then( () => {
						if ( id === this.#dawcore.$getId() ) {
							this.#oncmpClickNewLocal();
						}
						this.#dawcore.deleteComposition( saveMode, id );
					} );
			}
		} );
	}
	static #onwheel( e ) {
		if ( e.ctrlKey ) {
			e.preventDefault();
		}
	}
	static #onfocusin( obj, e ) {
		if ( !obj.rootElement.contains( e.target ) ) {
			obj.rootElement.focus();
		}
	}
	#onclickName( title, action, area, e ) {
		const id = area === "channels"
			? this.#mixer.getSelectedChannelId()
			: this.#dawcore.$getOpened( area );

		if ( id ) {
			MZRUI.$popup.prompt( title, "", e.currentTarget.textContent, "Rename" )
				.then( name => this.#dawcore.callAction( action, id, name ) );
		}
	}
	#onclickSynthChannel() {
		const id = this.#dawcore.$getOpened( "synth" );

		if ( id ) {
			mzruiChannels.openSelectChannelPopup( this.#dawcore.$getSynth( id ).dest )
				.then( chanId => chanId && this.#dawcore.callAction( "redirectSynth", id, chanId ) );
		}
	}
	#ondrop( e ) {
		const files = Array.from( e.dataTransfer.files );
		const cmpFile = files.find( f => f.name.split( "." ).pop().toLowerCase() in GSDAW.#dropExtensions );

		e.preventDefault();
		if ( cmpFile ) {
			this.#dawcore.addCompositionByBlob( cmpFile )
				.then( cmp => this.#dawcore.openComposition( "local", cmp.id ) );
		} else {
			this.#dawcore.dropAudioFiles( files );
		}
	}
	#oncmpDrop( saveMode, id ) {
		const to = saveMode === "local" ? "cloud" : "local";
		const cmpFrom = this.#dawcore.$getComposition( saveMode, id );
		const cmpTo = this.#dawcore.$getComposition( to, id );

		return !cmpTo
			? Promise.resolve( cmpFrom )
			: MZRUI.$popup.confirm( "Warning",
				"Are you sure you want to overwrite " +
				`the <b>${ to }</b> composition <i>${ cmpTo.name || "Untitled" }</i>&nbsp;?` )
				.then( b => {
					if ( b ) {
						return cmpFrom;
					}
					throw undefined;
				} );
	}
	#oncmpLocalDrop( saveMode, id ) {
		this.#oncmpDrop( saveMode, id )
			.then( cmp => this.#dawcore.addCompositionByJSObject( cmp, { saveMode: "local" } ) )
			.then( cmp => DAWCoreLocalStorage.put( cmp.id, cmp ) );
	}
	#oncmpCloudDrop( saveMode, id ) {
		if ( mzrapiClient.user.id ) {
			this.#oncmpDrop( saveMode, id )
				.then( cmp => this.#authSaveComposition( cmp ) )
				.then( cmp => this.#dawcore.addCompositionByJSObject( cmp, { saveMode: "cloud" } ) );
		} else {
			MZRUI.$popup.alert( "Error",
				"You need to be connected to your account before uploading your composition" );
		}
	}
	#authSaveComposition( cmp ) {
		return mzrapiClient.saveComposition( cmp )
			.then( () => cmp, err => {
				MZRUI.$popup.alert( `Error ${ err.code }`,
					"An error happened while saving your composition&nbsp;:<br/>" +
					`<code>${ err.msg || err }</code>`
				);
				throw err;
			} );
	}
	#authGetMe() {
		MZRUI.$setAttribute( this.rootElement, "logging", true );
		return mzrapiClient.getMe()
			.then( me => {
				this.#authLoginThen( me );
				return mzrapiClient.getUserCompositions( me.id );
			} )
			.then( cmps => {
				const opt = { saveMode: "cloud" };

				cmps.forEach( cmp => this.#dawcore.addCompositionByJSObject( cmp.data, opt ) );
			} )
			.catch( res => {
				if ( res.code !== 401 ) {
					throw res;
				}
			} )
			.finally( () => MZRUI.$setAttribute( this.rootElement, "logging", false ) );
	}
	#authLoginThen( me ) {
		MZRUI.$setAttribute( this.rootElement, "useravatar", me.avatar );
		MZRUI.$setAttribute( this.rootElement, "username", me.username );
		MZRUI.$setAttribute( this.rootElement, "logged", true );
		return me;
	}

	// .........................................................................
	#setTitle( cmpName ) {
		const name = cmpName || "MozaRythm";

		document.title = this.#dawcore.compositionNeedSave() ? `*${ name }` : name;
	}
	#selectChannel( id ) {
		this.#elements.channelName.textContent = this.#dawcore.$getChannel( id ).name;
		this.#effects.setDestFilter( id );
	}

	// .........................................................................
	#oncmpClosed( cmp ) {
		this.#oncmpChanged( {
			bpm: cmp.bpm,
			name: cmp.name,
			duration: cmp.duration,
		}, {} );
		MZRUI.$setAttribute( this.rootElement, "currentcomposition", false );
		this.#effects.clear();
		this.#synth.clear();
		this.#mixer.clear();
		this.#drums.clear();
		this.#pianoroll.clear();
		this.#patternroll.clear();
		this.#drums.rootElement.loop( false );
		this.#pianoroll.rootElement.loop( false );
		this.#patternroll.rootElement.loop( false );
		this.#elements.drumsName.textContent =
		this.#elements.synthName.textContent =
		this.#elements.pianorollName.textContent = "";
		this.#patterns.clear();
	}
	#oncmpChanged( obj, prevObj ) {
		console.log( "change", obj );
		this.#patterns.change( obj );
		this.#synth.change( obj );
		this.#drums.change( obj );
		this.#effects.change( obj );
		this.#mixer.change( obj );
		this.#slicer.change( obj );
		this.#pianoroll.change( obj );
		this.#patternroll.change( obj );
		GSDAW.#cmpChangedFns.forEach( ( fn, attrs ) => {
			if ( attrs.some( attr => attr in obj ) ) {
				fn.call( this, obj, prevObj );
			}
		} );
	}
	static #cmpChangedFns = new Map( [
		[ [ "channels" ], function( obj ) {
			const synOpenedChan = obj.channels[ this.#dawcore.$getSynth( this.#dawcore.$getOpened( "synth" ) ).dest ];
			const mixerSelectedChan = obj.channels[ this.#effects.getDestFilter() ];

			if ( synOpenedChan && "name" in synOpenedChan ) {
				this.#elements.synthChannelBtnText.textContent = synOpenedChan.name;
			}
			if ( mixerSelectedChan && "name" in mixerSelectedChan ) {
				this.#elements.channelName.textContent = mixerSelectedChan.name;
			}
		} ],
		[ [ "synths" ], function( obj ) {
			const synOpened = obj.synths[ this.#dawcore.$getOpened( "synth" ) ];

			if ( synOpened ) {
				if ( "name" in synOpened ) {
					this.#elements.synthName.textContent = synOpened.name;
				}
				if ( "dest" in synOpened ) {
					this.#elements.synthChannelBtnText.textContent = this.#dawcore.$getChannel( synOpened.dest ).name;
				}
			}
		} ],
		[ [ "patterns" ], function( obj ) {
			Object.entries( obj.patterns ).forEach( kv => this.#onupdatePattern( ...kv ) );
		} ],
		[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
			MZRUI.$setAttribute( this.rootElement, "timedivision", `${ this.#dawcore.$getBeatsPerMeasure() }/${ this.#dawcore.$getStepsPerBeat() }` );
		} ],
		[ [ "bpm" ], function( { bpm } ) {
			MZRUI.$setAttribute( this.rootElement, "bpm", bpm );
			this.rootElement.updateComposition( this.#dawcore.$getCmp() );
		} ],
		[ [ "name" ], function( { name } ) {
			this.#setTitle( name );
			this.rootElement.updateComposition( this.#dawcore.$getCmp() );
			MZRUI.$setAttribute( this.rootElement, "name", name );
		} ],
		[ [ "duration" ], function( { duration } ) {
			if ( this.#dawcore.getFocusedName() === "composition" ) {
				MZRUI.$setAttribute( this.rootElement, "duration", duration );
			}
			this.rootElement.updateComposition( this.#dawcore.$getCmp() );
		} ],
		[ [ "patternSlicesOpened" ], function( obj ) {
			if ( obj.patternSlicesOpened ) {
				const pat = this.#dawcore.$getPattern( obj.patternSlicesOpened );

				this.#elements.slicesName.textContent = pat.name;
				this.#windows.window( "slicer" ).open();
				if ( this.#dawcore.getFocusedName() === "slices" ) {
					MZRUI.$setAttribute( this.rootElement, "duration", this.#dawcore.$getPattern( pat.source )?.duration ?? this.#dawcore.$getBeatsPerMeasure() );
				}
			} else {
				this.#elements.slicesName.textContent = "";
			}
		} ],
		[ [ "patternDrumsOpened" ], function( obj ) {
			if ( obj.patternDrumsOpened ) {
				const pat = this.#dawcore.$getPattern( obj.patternDrumsOpened );

				this.#elements.drumsName.textContent = pat.name;
				this.#windows.window( "drums" ).open();
				if ( this.#dawcore.getFocusedName() === "drums" ) {
					MZRUI.$setAttribute( this.rootElement, "duration", pat.duration );
				}
			} else {
				this.#elements.drumsName.textContent = "";
			}
		} ],
		[ [ "synthOpened" ], function( obj ) {
			if ( obj.synthOpened ) {
				const syn = this.#dawcore.$getSynth( obj.synthOpened );

				this.#elements.synthName.textContent = syn.name;
				this.#elements.synthChannelBtnText.textContent = this.#dawcore.$getChannel( this.#dawcore.$getSynth( obj.synthOpened ).dest ).name;
				this.#windows.window( "synth" ).open();
			} else {
				this.#elements.synthName.textContent = "";
				this.#elements.synthChannelBtnText.textContent = "";
			}
		} ],
		[ [ "patternKeysOpened" ], function( { patternKeysOpened } ) {
			if ( patternKeysOpened ) {
				const pat = this.#dawcore.$getPattern( patternKeysOpened );

				this.#elements.pianorollName.textContent = pat.name;
				if ( this.#dawcore.getFocusedName() === "keys" ) {
					MZRUI.$setAttribute( this.rootElement, "duration", pat.duration );
				}
				this.#windows.window( "piano" ).open();
			} else {
				this.#elements.pianorollName.textContent = "";
			}
		} ],
	] );
	#onupdatePattern( id, obj ) {
		if ( obj ) {
			if ( "duration" in obj ) {
				const foc = this.#dawcore.getFocusedName();

				if ( foc !== "composition" && id === this.#dawcore.$getOpened( foc ) ) {
					MZRUI.$setAttribute( this.rootElement, "duration", obj.duration );
				}
			}
			if ( "name" in obj ) {
				const name = obj.name;

				this.#patternroll.rootElement.getBlocks().forEach( blc => {
					if ( blc.dataset.pattern === id ) {
						blc.querySelector( ".mzruiPatternroll-block-name" ).textContent = name;
					}
				} );
				if ( id === this.#dawcore.$getOpened( "slices" ) ) {
					this.#elements.slicesName.textContent = name;
				}
				if ( id === this.#dawcore.$getOpened( "keys" ) ) {
					this.#elements.pianorollName.textContent = name;
				}
				if ( id === this.#dawcore.$getOpened( "drums" ) ) {
					this.#elements.drumsName.textContent = name;
				}
			}
		}
	}
	#onpatternsBuffersLoaded( buffers ) {
		const patSli = this.#dawcore.$getPattern( this.#dawcore.$getOpened( "slices" ) );
		const sliBuf = patSli?.source && this.#dawcore.$getPattern( patSli.source ).buffer;

		if ( sliBuf in buffers ) {
			this.#slicer.rootElement.setBuffer( buffers[ sliBuf ].buffer );
		}
		this.#patterns.bufferLoaded( buffers );
		this.#patternroll.rootElement.getBlocks().forEach( ( elBlc, blcId ) => {
			const blc = this.#dawcore.$getBlock( blcId );
			const pat = this.#dawcore.$getPattern( blc.pattern );

			if ( pat.type === "buffer" && pat.buffer in buffers ) {
				const bpm = pat.bufferBpm || this.#dawcore.$getBPM();

				MZRUI.$setAttribute( elBlc, "data-missing", false );
				this.#patterns.svgForms.buffer.setSVGViewbox( elBlc._mzruiSVGform, blc.offset, blc.duration, bpm / 60 );
			}
		} );
	}
}

Object.freeze( MZRDAW );
