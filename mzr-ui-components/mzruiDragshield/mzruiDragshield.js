"use strict";

class mzruiDragshield extends HTMLElement {
	show( cursor ) {
		if ( cursor ) {
			this.style.cursor = cursor;
		}
		this.classList.add( "mzruiDragshield-show" );
	}
	hide() {
		this.style.cursor = "";
		this.classList.remove( "mzruiDragshield-show" );
	}
}

Object.freeze( mzruiDragshield );
customElements.define( "mzrui-dragshield", mzruiDragshield );
