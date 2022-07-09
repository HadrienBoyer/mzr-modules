"use strict";

class MZRUI {
	static $noop() {}
	static $popup = document.createElement( "mzrui-popup" );
	static $dragshield = document.createElement( "mzrui-dragshield" );

	// .........................................................................
	static $clamp( n, min, max ) {
		return (
			min < max
				? Math.max( min, Math.min( n || 0, max ) )
				: Math.max( max, Math.min( n || 0, min ) )
		);
	}

	// .........................................................................
	static $diffObjects( a, b ) {
		let empty = true;
		const diff = Object.entries( b ).reduce( ( diff, [ bk, bv ] ) => {
			const av = a[ bk ];
			const newval = av === bv ? undefined :
				typeof bv !== "object" || bv === null ? bv :
				typeof av !== "object" || av === null
					? Object.freeze( JSON.parse( JSON.stringify( bv ) ) )
					: MZRUI.$diffObjects( av, bv );

			if ( newval !== undefined ) {
				empty = false;
				diff[ bk ] = newval;
			}
			return diff;
		}, {} );

		Object.keys( a ).forEach( ak => {
			if ( !( ak in b ) ) {
				empty = false;
				diff[ ak ] = undefined;
			}
		} );
		return empty ? undefined : Object.freeze( diff );
	}

	// .........................................................................
	static $findElements( root, graph ) {
		return typeof graph === "string"
			? MZRUI.#findElemStr( root, graph )
			: Object.seal( Array.isArray( graph )
				? MZRUI.#findElemArr( root, graph )
				: MZRUI.#findElemObj( root, graph ) );
	}
	static #findElemArr( root, arr ) {
		return arr.map( sel => MZRUI.$findElements( root, sel ) );
	}
	static #findElemObj( root, obj ) {
		if ( obj ) {
			const ent = Object.entries( obj );

			ent.forEach( kv => kv[ 1 ] = MZRUI.$findElements( root, kv[ 1 ] ) );
			return Object.fromEntries( ent );
		}
	}
	static #findElemStr( root, sel ) {
		if ( Array.isArray( root ) ) {
			let el;

			Array.prototype.find.call( root, r => el = MZRUI.#findElemQuery( r, sel ) );
			return el || null;
		}
		return MZRUI.#findElemQuery( root, sel );
	}
	static #findElemQuery( root, sel ) {
		return root.matches( sel )
			? root
			: root.querySelector( sel );
	}

	// .........................................................................
	static $dispatchEvent( el, component, eventName, ...args ) {
		el.dispatchEvent( new CustomEvent( "mzruiEvents", {
			bubbles: true,
			detail: { component, eventName, args },
		} ) );
	}
	static $listenEvents( el, cbs ) {
		el.addEventListener( "mzruiEvents", e => {
			const d = e.detail;
			const cbs2 = cbs[ d.component ] || cbs.default;
			const fn = cbs2 && ( cbs2[ d.eventName ] || cbs2.default );

			if ( fn && fn( d, e.target, e ) !== true ) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		} );
	}

	// .........................................................................
	static #templates = new Map();
	static $setTemplate( tmpId, fn ) {
		MZRUI.#templates.set( tmpId, fn );
	}
	static $hasTemplate( tmpId ) {
		return MZRUI.#templates.has( tmpId );
	}
	static $getTemplate( tmpId, ...args ) {
		return MZRUI.#templates.get( tmpId )( ...args );
	}

	// .........................................................................
	static $createElement( tag, attr, ...children ) {
		return MZRUI.#createElement( "http://www.w3.org/1999/xhtml", tag, attr, children );
	}
	static $createElementSVG( tag, attr, ...children ) {
		return MZRUI.#createElement( "http://www.w3.org/2000/svg", tag, attr, children );
	}
	static #createElement( ns, tag, attrObj, children ) {
		const el = document.createElementNS( ns, tag );

		MZRUI.$setAttribute( el, attrObj );
		el.append( ...children.flat( 1 ).filter( ch => Boolean( ch ) || Number.isFinite( ch ) ) );
		return el;
	}
	static $setAttribute( el, attr, val ) {
		if ( typeof attr === "string" ) {
			MZRUI.#setAttribute( el, attr, val );
		} else if ( attr ) {
			Object.entries( attr ).forEach( kv => MZRUI.#setAttribute( el, ...kv ) );
		}
	}
	static $setGetAttribute( el, attr, val ) {
		MZRUI.#setAttribute( el, attr, val );
		return MZRUI.$getAttribute( el, attr );
	}
	static #setAttribute( el, attr, val ) {
		val !== false && val !== null && val !== undefined
			? el.setAttribute( attr, val === true ? "" : val )
			: el.removeAttribute( attr );
	}
	static $hasAttribute( el, attr ) {
		return el.hasAttribute( attr );
	}
	static $getAttribute( el, attr ) {
		return el.getAttribute( attr );
	}
	static $getAttributeNum( el, attr ) {
		const val = el.getAttribute( attr );
		const n = +val;

		if ( Number.isNaN( n ) ) {
			console.error( `MZRUI.$getAttributeNum: ${ attr } is NaN (${ val })` );
		}
		return n;
	}

	// .........................................................................
	static $observeSizeOf( el, fn ) {
		if ( MZRUI.#resizeMap.has( el ) ) {
			MZRUI.#resizeMap.get( el ).push( fn );
		} else {
			MZRUI.#resizeMap.set( el, [ fn ] );
		}
		MZRUI.#resizeObs.observe( el );
	}
	static $unobserveSizeOf( el, fn ) {
		const fns = MZRUI.#resizeMap.get( el );
		const fnInd = fns.indexOf( fn );

		MZRUI.#resizeObs.unobserve( el );
		if ( fnInd > -1 ) {
			fns.splice( fnInd, 1 );
			if ( fns.length === 0 ) {
				MZRUI.#resizeMap.delete( el );
			}
		}
	}
	static #resizeMap = new Map();
	static #resizeObs = new ResizeObserver( entries => {
		entries.forEach( e => {
			MZRUI.#resizeMap.get( e.target )
				.forEach( fn => fn( e.contentRect.width, e.contentRect.height ) );
		} );
	} );

	// .........................................................................
	static $emptyElement( el ) {
		while ( el.lastChild ) {
			el.lastChild.remove();
		}
	}

	// .........................................................................
	static $unselectText() {
		window.getSelection().removeAllRanges();
	}

	// .........................................................................
	static $recallAttributes( el, props ) {
		Object.entries( props ).forEach( ( [ p, val ] ) => {
			el.hasAttribute( p )
				? el.attributeChangedCallback( p, null, el.getAttribute( p ) )
				: MZRUI.#setAttribute( el, p, val );
		} );
	}
}

document.body.prepend( MZRUI.$dragshield, MZRUI.$popup );
