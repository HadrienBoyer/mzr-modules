"use strict";

class mzruiPopup extends HTMLElement {
	#type = "";
	#isOpen = false;
	#resolve = null;
	#fnSubmit = null;
	#children = MZRUI.$getTemplate( "mzrui-popup" );
	#elements = MZRUI.$findElements( this.#children, {
		ok: ".mzruiPopup-ok",
		cnt: ".mzruiPopup-content",
		msg: ".mzruiPopup-message",
		text: ".mzruiPopup-inputText",
		form: ".mzruiPopup-body",
		window: ".mzruiPopup-window",
		header: ".mzruiPopup-head",
		cancel: ".mzruiPopup-cancel",
	} );
	#clWindow = this.#elements.window.classList;

	constructor() {
		super();
		Object.seal( this );

		this.onclick =
		this.#elements.cancel.onclick = this.#cancelClick.bind( this );
		this.#elements.form.onsubmit = this.#submit.bind( this );
		this.#elements.window.onkeyup =
		this.#elements.window.onclick = e => e.stopPropagation();
		this.#elements.window.onkeydown = e => {
			e.stopPropagation();
			if ( e.key === "Escape" ) {
				this.#cancelClick();
			}
		};
	}

	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( this.#children );
			this.#children = null;
		}
	}

	// .........................................................................
	alert( title, msg, ok ) {
		MZRUI.$emptyElement( this.#elements.cnt );
		this.#clWindow.add( "mzruiPopup-noText", "mzruiPopup-noCancel" );
		this.#setOkCancelBtns( ok, false );
		return this.#open( "alert", title, msg );
	}
	confirm( title, msg, ok, cancel ) {
		MZRUI.$emptyElement( this.#elements.cnt );
		this.#clWindow.remove( "mzruiPopup-noCancel" );
		this.#clWindow.add( "mzruiPopup-noText" );
		this.#setOkCancelBtns( ok, cancel );
		return this.#open( "confirm", title, msg );
	}
	prompt( title, msg, val, ok, cancel ) {
		MZRUI.$emptyElement( this.#elements.cnt );
		this.#clWindow.remove( "mzruiPopup-noText", "mzruiPopup-noCancel" );
		this.#setOkCancelBtns( ok, cancel );
		return this.#open( "prompt", title, msg, val );
	}
	custom( obj ) {
		MZRUI.$emptyElement( this.#elements.cnt );
		this.#fnSubmit = obj.submit || null;
		this.#clWindow.remove( "mzruiPopup-noText" );
		this.#setOkCancelBtns( obj.ok, obj.cancel || false );
		obj.element
			? this.#elements.cnt.append( obj.element )
			: this.#elements.cnt.append( ...obj.elements );
		return this.#open( "custom", obj.title );
	}
	close() {
		if ( this.#isOpen ) {
			this.#cancelClick();
		}
	}

	// .........................................................................
	#setOkCancelBtns( ok, cancel ) {
		this.#clWindow.toggle( "mzruiPopup-noCancel", cancel === false );
		this.#elements.cancel.value = cancel || "Cancel";
		this.#elements.ok.value = ok || "Ok";
	}
	#open( type, title, msg, value ) {
		this.#type = type;
		this.#isOpen = true;
		this.#elements.header.textContent = title;
		this.#elements.msg.innerHTML = msg || "";
		this.#elements.text.value = arguments.length > 3 ? value : "";
		this.#elements.window.dataset.type = type;
		this.classList.add( "mzruiPopup-show" );
		setTimeout( () => {
			if ( type === "prompt" ) {
				this.#elements.text.select();
			} else {
				const inp = type !== "custom" ? null
					: this.#elements.cnt.querySelector( "input, select" );

				( inp || this.#elements.ok ).focus();
			}
		}, 250 );
		return new Promise( res => this.#resolve = res )
			.then( val => {
				this.#isOpen = false;
				this.classList.remove( "mzruiPopup-show" );
				return val;
			} );
	}
	#cancelClick() {
		this.#resolve(
			this.#type === "confirm" ? false :
			this.#type === "prompt" ? null : undefined );
	}
	#submit() {
		switch ( this.#type ) {
			case "alert": this.#resolve( undefined ); break;
			case "prompt": this.#resolve( this.#elements.text.value ); break;
			case "confirm": this.#resolve( true ); break;
			case "custom": this.#submitCustom(); break;
		}
		return false;
	}
	#getInputValue( inp ) {
		switch ( inp.type ) {
			default: return inp.value;
			case "file": return inp.files;
			case "radio": return inp.checked ? inp.value : null;
			case "range":
			case "number": return +inp.value;
			case "checkbox": return inp.checked;
			case "select-one": return Number.isNaN( +inp.value ) ? inp.value : +inp.value;
		}
	}
	#submitCustom() {
		const fn = this.#fnSubmit;
		const inps = Array.from( this.#elements.form );
		const obj = inps.reduce( ( obj, inp ) => {
			if ( inp.name ) {
				const val = this.#getInputValue( inp );

				if ( val !== null ) {
					obj[ inp.name ] = val;
				}
			}
			return obj;
		}, {} );

		if ( !fn ) {
			this.#resolve( obj );
		} else {
			const fnRes = fn( obj );

			if ( fnRes !== false ) {
				fnRes && fnRes.then
					? fnRes.then( res => {
						if ( res !== false ) {
							this.#resolve( obj );
						}
					} )
					: this.#resolve( obj );
			}
		}
	}
}

Object.freeze( mzruiPopup );
customElements.define( "mzrui-popup", mzruiPopup );
