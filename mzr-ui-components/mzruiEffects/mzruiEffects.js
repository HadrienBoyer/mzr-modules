"use strict";

class mzruiEffects extends HTMLElement {
	static fxsMap = new Map();
	#fxsHtml = new Map();
	#dispatch = MZRUI.$dispatchEvent.bind( null, this, "mzruiEffects" );
	#children = MZRUI.$getTemplate( "mzrui-effects" );
	#elements = MZRUI.$findElements( this.#children, {
		list: ".mzruiEffects-list",
		addBtn: ".mzruiEffects-addBtn",
		addSelect: ".mzruiEffects-addSelect",
	} );

	constructor() {
		super();
		this.askData = MZRUI.$noop;
		Object.seal( this );

		this.#elements.addBtn.onclick = () => this.#elements.addSelect.value = "";
		this.#elements.addSelect.onchange = this.#onchangeAddSelect.bind( this );
		this.#elements.addSelect.onkeydown = () => false;
		new mzruiReorder( {
			rootElement: this.#elements.list,
			direction: "column",
			dataTransferType: "effect",
			itemSelector: ".mzruiEffects-fx",
			handleSelector: ".mzruiEffects-fx-grip",
			parentSelector: ".mzruiEffects-list",
		} );
		MZRUI.$listenEvents( this, {
			default: {
				liveChange( d, t ) {
					d.args.unshift( t.dataset.id );
					d.component = "mzruiEffects";
					d.eventName = "liveChangeEffect";
					return true;
				},
				changeProp( d, t ) {
					d.args.unshift( t.dataset.id );
					d.component = "mzruiEffects";
					d.eventName = "changeEffect";
					return true;
				},
			},
		} );
		this.#elements.addSelect.append( ...mzruiEffects.#createOptions() );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( this.#elements.list );
		}
	}

	// .........................................................................
	getFxHTML( id ) {
		return this.#fxsHtml.get( id );
	}
	expandToggleEffect( id ) {
		const root = this.#fxsHtml.get( id ).root;

		this.expandEffect( id, !root.classList.contains( "mzruiEffects-fx-expanded" ) );
	}
	expandEffect( id, b ) {
		const html = this.#fxsHtml.get( id );
		const type = html.root.dataset.type;

		html.root.classList.toggle( "mzruiEffects-fx-expanded", b );
		html.expand.dataset.icon = b ? "caret-down" : "caret-right";
		html.content.style.height = `${ b ? mzruiEffects.fxsMap.get( type ).height : 0 }px`;
	}

	// .........................................................................
	addEffect( id, fx ) {
		const root = MZRUI.$getTemplate( "mzrui-effects-fx" );
		const name = root.querySelector( ".mzruiEffects-fx-name" );
		const expand = root.querySelector( ".mzruiEffects-fx-expand" );
		const toggle = root.querySelector( ".mzruiEffects-fx-toggle" );
		const remove = root.querySelector( ".mzruiEffects-fx-remove" );
		const content = root.querySelector( ".mzruiEffects-fx-content" );
		const fxAsset = mzruiEffects.fxsMap.get( fx.type );
		const uiFx = new fxAsset.cmp();
		const html = Object.seal( {
			uiFx,
			root,
			expand,
			content,
		} );

		expand.onclick = () => this.expandToggleEffect( id );
		toggle.onclick = () => this.#dispatch( "toggleEffect", id );
		remove.onclick = () => this.#dispatch( "removeEffect", id );
		uiFx.askData = this.askData.bind( null, id, fx.type );
		uiFx.dataset.id = id;
		root.dataset.type = fx.type;
		name.textContent = fxAsset.name;
		content.append( uiFx );
		this.#fxsHtml.set( id, html );
		this.#elements.list.append( root );
	}
	removeEffect( id ) {
		this.#fxsHtml.get( id ).root.remove();
		this.#fxsHtml.delete( id );
	}
	changeEffect( id, prop, val ) {
		switch ( prop ) {
			case "toggle": this.#changeToggle( id, val ); break;
			case "order": this.#fxsHtml.get( id ).root.dataset.order = val; break;
		}
	}
	#changeToggle( id, b ) {
		const html = this.#fxsHtml.get( id );

		html.root.classList.toggle( "mzruiEffects-fx-enable", b );
		html.uiFx.toggle( b );
	}
	reorderEffects( effects ) {
		mzruiReorder.listReorder( this.#elements.list, effects );
	}

	// .........................................................................
	#onchangeAddSelect() {
		const type = this.#elements.addSelect.value;

		this.#elements.addSelect.blur();
		this.#elements.addSelect.value = "";
		this.#dispatch( "addEffect", type );
	}

	// .........................................................................
	static #createOptions() {
		const def = mzruiEffects.#createOption( true, "", "-- Select an Fx" );
		const options = [ def ];

		mzruiEffects.fxsMap.forEach( ( fx, id ) => {
			options.push( mzruiEffects.#createOption( false, id, fx.name ) );
		} );
		return options;
	}
	static #createOption( disabled, fxId, fxName ) {
		return MZRUI.$createElement( "option", { value: fxId, disabled }, fxName );
	}
}

Object.freeze( mzruiEffects );
customElements.define( "mzrui-effects", mzruiEffects );
