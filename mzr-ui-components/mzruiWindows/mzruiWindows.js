"use strict";

class mzruiWindows extends HTMLElement {
	#objWindows = {};
	#nbWindowsMaximized = 0;
	#mouseFnUp = null;
	#mouseFnMove = null;
	#focusedWindow = null;

	constructor() {
		super();
		this.onopen =
		this.onclose = null;
		this._arrWindows = [];
		this._lowGraphics = false;
		Object.seal( this );
	}

	// .........................................................................
	lowGraphics( b ) {
		this._lowGraphics = b;
		this.classList.toggle( "mzruiWindows-lowGraphics", b );
	}
	createWindow( id ) {
		const win = MZRUI.$createElement( "mzrui-window" );

		win.setId( id );
		win.setParent( this );
		win.movable( true );
		win.addEventListener( "focusin", this._onfocusinWin.bind( this, win ) );
		this._arrWindows.push( win );
		this.#objWindows[ id ] = win;
		this.append( win );
		return win;
	}
	window( winId ) {
		return this.#objWindows[ winId ];
	}

	// .........................................................................
	_startMousemoving( cursor, fnMove, fnUp ) {
		this.#mouseFnUp = this._stopMousemoving.bind( this, fnUp );
		this.#mouseFnMove = fnMove;
		document.addEventListener( "mouseup", this.#mouseFnUp );
		document.addEventListener( "mousemove", fnMove );
		MZRUI.$unselectText();
		MZRUI.$dragshield.show( cursor );
	}
	_stopMousemoving( fnUp, e ) {
		document.removeEventListener( "mouseup", this.#mouseFnUp );
		document.removeEventListener( "mousemove", this.#mouseFnMove );
		MZRUI.$dragshield.hide();
		this.#mouseFnUp =
		this.#mouseFnMove = null;
		fnUp( e );
	}
	_open( win ) {
		win.focus();
		this._onfocusinWin( win );
		if ( this.onopen ) {
			this.onopen( win );
		}
	}
	_close( win ) {
		if ( win === this.#focusedWindow ) {
			this.#focusedWindow = null;
		}
		if ( this.onclose ) {
			this.onclose( win );
		}
	}
	_onfocusinWin( win, e ) {
		if ( win !== this.#focusedWindow ) {
			const z = win.getZIndex();

			this._arrWindows.forEach( win => {
				if ( win.getZIndex() > z ) {
					win.setZIndex( win.getZIndex() - 1 );
				}
			} );
			win.setZIndex( this._arrWindows.length - 1 );
			this.#focusedWindow = win;
		}
		if ( e && win.onfocusin ) {
			win.onfocusin( e );
		}
	}
	_winMaximized( _winId ) {
		++this.#nbWindowsMaximized;
		this.classList.add( "mzruiWindows-maximized" );
		this.scrollTop =
		this.scrollLeft = 0;
	}
	_winRestored( _winId ) {
		if ( --this.#nbWindowsMaximized === 0 ) {
			this.classList.remove( "mzruiWindows-maximized" );
		}
	}
}

Object.freeze( mzruiWindows );
customElements.define( "mzrui-windows", mzruiWindows );
