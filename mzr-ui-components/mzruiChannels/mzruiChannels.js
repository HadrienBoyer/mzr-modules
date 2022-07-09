"use strict";

class mzruiChannels extends HTMLElement {
	#chans = {};
	#chanSelected = null;
	#analyserW = 10;
	#analyserH = 50;
	#onresizeBind = this.#onresize.bind( this );
	#children = MZRUI.$getTemplate( "mzrui-channels" );
	#elements = MZRUI.$findElements( this.#children, {
		pmain: ".mzruiChannels-panMain",
		pchans: ".mzruiChannels-panChannels",
		addBtn: ".mzruiChannels-addChan",
	} );
	static #selectChanPopup = MZRUI.$getTemplate( "mzrui-channels-selectPopup" );
	static #selectChanInput = mzruiChannels.#selectChanPopup.querySelector( "select" );

	constructor() {
		super();

		this.oninput =
		this.onchange =
		this.onselectChan = null;
		Object.seal( this );

		this.#elements.addBtn.onclick = () => this.onchange( "addChannel" );
		MZRUI.$listenEvents( this, {
			mzruiChannel: {
				liveChange: ( d, chan ) => this.oninput( chan.dataset.id, ...d.args ),
				change: ( d, chan ) => this.onchange( "changeChannel", chan.dataset.id, ...d.args ),
			},
		} );
		new mzruiReorder( {
			rootElement: this,
			direction: "row",
			dataTransferType: "channel",
			itemSelector: "mzrui-channel",
			handleSelector: ".mzruiChannel-grip",
			parentSelector: ".mzruiChannels-panChannels",
			onchange: elChan => {
				this.onchange( "reorderChannel", elChan.dataset.id,
					mzruiReorder.listComputeOrderChange( this.#elements.pchans, {} ) );
			},
		} );
	}

	// .........................................................................
	connectedCallback() {
		if ( !this.firstChild ) {
			this.append( ...this.#children );
			this.#children = null;
		}
		MZRUI.$observeSizeOf( this, this.#onresizeBind );
	}
	disconnectedCallback() {
		MZRUI.$unobserveSizeOf( this, this.#onresizeBind );
	}

	// .........................................................................
	#onresize() {
		const chans = Object.values( this.#chans );

		if ( chans.length ) {
			const { width, height } = chans[ 0 ].analyser.getBoundingClientRect();

			this.#analyserW = width;
			this.#analyserH = height;
			chans.forEach( chan => chan.analyser.setResolution( width, height ) );
		}
	}
	updateAudioData( id, ldata, rdata ) {
		this.#chans[ id ].analyser.draw( ldata, rdata );
	}
	getSelectedChannelId() {
		return this.#chanSelected;
	}
	selectChannel( id ) {
		const chan = this.#chans[ id ];
		const pchan = this.#chans[ this.#chanSelected ];

		pchan && MZRUI.$setAttribute( pchan, "selected", false );
		MZRUI.$setAttribute( chan, "selected", true );
		this.#chanSelected = id;
		this.#updateChanConnections();
		this.onselectChan( id );
	}
	static openSelectChannelPopup( currChanId ) {
		return new Promise( res => {
			mzruiChannels.#selectChanInput.value = currChanId;
			MZRUI.$popup.custom( {
				title: "Channels",
				element: mzruiChannels.#selectChanPopup,
				submit( data ) {
					res( data.channel !== currChanId ? data.channel : null );
				}
			} );
		} );
	}

	// .........................................................................
	addChannel( id ) {
		const chan = MZRUI.$createElement( "mzrui-channel", { "data-id": id } );
		const qs = n => chan.querySelector( `.mzruiChannel-${ n }` );

		( id === "main" ? this.#elements.pmain : this.#elements.pchans ).append( chan );
		mzruiChannels.#selectChanInput.append( MZRUI.$createElement( "option", { value: id }, name ) );
		this.#chans[ id ] = chan;
		chan.analyser.onclick =
		qs( "nameWrap" ).onclick = this.selectChannel.bind( this, id );
		qs( "toggle" ).onclick = () => this.onchange( "toggleChannel", id );
		qs( "delete" ).onclick = () => this.onchange( "removeChannel", id );
		qs( "connect" ).onclick = () => this.onchange( "redirectChannel", this.#chanSelected, id );
		chan.analyser.setResolution( this.#analyserW, this.#analyserH );
		if ( this.#chanSelected ) {
			this.#updateChanConnections();
		} else if ( id === "main" ) {
			this.selectChannel( id );
		}
	}
	removeChannel( id ) {
		const chan = this.#chans[ id ];

		if ( id === this.#chanSelected ) {
			const next = this.#getNextChan( chan, "nextElementSibling" );

			if ( next ) {
				this.selectChannel( next.dataset.id );
			} else {
				const prev = this.#getNextChan( chan, "previousElementSibling" );

				this.selectChannel( prev ? prev.dataset.id : "main" );
			}
		}
		delete this.#chans[ id ];
		chan.remove();
		mzruiChannels.#selectChanInput.querySelector( `option[value="${ id }"]` ).remove();
	}
	toggleChannel( id, b ) {
		MZRUI.$setAttribute( this.#chans[ id ], "muted", !b );
	}
	changePanChannel( id, val ) {
		MZRUI.$setAttribute( this.#chans[ id ], "pan", val );
	}
	changeGainChannel( id, val ) {
		MZRUI.$setAttribute( this.#chans[ id ], "gain", val );
	}
	renameChannel( id, name ) {
		MZRUI.$setAttribute( this.#chans[ id ], "name", name );
		mzruiChannels.#selectChanInput.querySelector( `option[value="${ id }"]` ).textContent = name;
	}
	reorderChannel( id, n ) {
		this.#chans[ id ].dataset.order = n;
	}
	reorderChannels( channels ) {
		mzruiReorder.listReorder( this.#elements.pchans, channels );
	}
	redirectChannel( id, dest ) {
		this.#chans[ id ].dataset.dest = dest;
		this.#updateChanConnections();
	}

	// .........................................................................
	#getNextChan( el, dir ) {
		const sibling = el[ dir ];

		return sibling && "id" in sibling.dataset ? sibling : null;
	}
	#updateChanConnections() {
		const selId = this.#chanSelected;

		if ( selId ) {
			const chan = this.#chans[ selId ];
			const chanDest = chan.dataset.dest;
			let bOnce = false;

			Object.entries( this.#chans ).forEach( ( [ id, chan ] ) => {
				const a = id === chanDest;
				const b = chan.dataset.dest === selId;

				MZRUI.$setAttribute( chan, "connecta", a ? "up" : "" );
				MZRUI.$setAttribute( chan, "connectb", b ? "down" : "" );
				bOnce = bOnce || b;
			} );
			MZRUI.$setAttribute( chan, "connecta", selId !== "main" ? "down" : "" );
			MZRUI.$setAttribute( chan, "connectb", bOnce ? "up" : "" );
		}
	}
}

Object.freeze( mzruiChannels );
customElements.define( "mzrui-channels", mzruiChannels );
