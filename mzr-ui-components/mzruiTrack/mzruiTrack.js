"use strict";

class mzruiTrack extends HTMLElement {
	rowElement = MZRUI.$getTemplate( "mzrui-track-row" );
	#children = MZRUI.$getTemplate( "mzrui-track" );
	#inpName = this.#children[ 1 ].firstChild;

	constructor() {
		super();
		Object.seal( this );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.classList.add( "mzrui-mute" );
			this.append( ...this.#children );
			this.#children = null;
		}
	}
	static get observedAttributes() {
		return [ "toggle", "name", "order" ];
	}
	attributeChangedCallback( prop, prev, val ) {
		if ( prev !== val ) {
			switch ( prop ) {
				case "toggle":
					this.classList.toggle( "mzrui-mute", val === null );
					this.rowElement.classList.toggle( "mzrui-mute", val === null );
					break;
				case "name":
					this.#inpName.value = val;
					break;
				case "order":
					this.dataset.order = val;
					this.#inpName.placeholder = `track ${ +val + 1 }`;
					break;
			}
		}
	}
}

Object.freeze( mzruiTrack );
customElements.define( "mzrui-track", mzruiTrack );
