"use strict";

function lg( a ) { return console.log.apply( console, arguments ), a; }

(() => {

	document.addEventListener( "mzruiEvents", e => {
		const { component, eventName, args } = e.detail;

		console.warn( `mzruiEvent: [${ component }][${ eventName }]`, args );
	} );

	document.body.append(
		MZRUI.$createElement( "div", { id: "testBody" },
			MZRUI.$createElement( "div", { id: "testHead" },
				MZRUI.$createElement( "span", { id: "testTitle" }, "MZRUI components testing" ),
				MZRUI.$createElement( "select", { id: "testSelect" },
					MZRUI.$createElement( "option", { value: "" }, "--" ),
					MZRUI.$createElement( "option", { value: "mzruiDAW" }, "mzruiDAW" ),
					MZRUI.$createElement( "option", { value: "mzruiChannel" }, "mzruiChannel" ),
					MZRUI.$createElement( "option", { value: "mzruiClock" }, "mzruiClock" ),
					MZRUI.$createElement( "option", { value: "mzruiEnvelope" }, "mzruiEnvelope" ),
					MZRUI.$createElement( "option", { value: "mzruiKeys" }, "mzruiKeys" ),
					MZRUI.$createElement( "option", { value: "mzruiLFO" }, "mzruiLFO" ),
					MZRUI.$createElement( "option", { value: "mzruiOscillator" }, "mzruiOscillator" ),
					MZRUI.$createElement( "option", { value: "mzruiSlicer" }, "mzruiSlicer" ),
					MZRUI.$createElement( "option", { value: "mzruiSlider" }, "mzruiSlider" ),
					MZRUI.$createElement( "option", { value: "mzruiSliderGroup" }, "mzruiSliderGroup" ),
					MZRUI.$createElement( "option", { value: "mzruiSynthesizer" }, "mzruiSynthesizer" ),
					MZRUI.$createElement( "option", { value: "mzruiTimeline" }, "mzruiTimeline" ),
					MZRUI.$createElement( "option", { value: "mzruiTimewindow" }, "mzruiTimewindow" ),
				),
			),
			MZRUI.$createElement( "div", { id: "testContent" },
				MZRUI.$createElement( "div", { id: "testWrap" } ),
				MZRUI.$createElement( "div", { id: "testCtrls" } ),
			),
			MZRUI.$createElement( "div", { id: "testDeps" } ),
		),
		MZRUI.$createElement( "div", { id: "testFoot" },
			MZRUI.$createElement( "div", { id: "testCopyright" },
				MZRUI.$createElement( "span", null, "© 2022 " ),
				MZRUI.$createElement( "a", { href: "https://mozarythm.com" }, "mozarythm.com" ),
				MZRUI.$createElement( "span", null, " all rights reserved" ),
			),
		),
	);

	const elTEST = document.querySelector( "#TEST" );
	const elCTRLS = document.querySelector( "#TEST-CTRLS" );
	elTEST && Array.from( elTEST.children ).forEach( el => document.querySelector( "#testWrap" ).append( el ) );
	elCTRLS && Array.from( elCTRLS.children ).forEach( el => document.querySelector( "#testCtrls" ).append( el ) );

	function getPath() {
		return location.pathname.split( "/" ).filter( Boolean );
	}

	const select = document.querySelector( "#testSelect" );
	const path = getPath();
	const curr = path.pop();

	document.title = `${ curr } (dev)`;
	select.value = curr;
	select.onchange = e => {
		const path = getPath();

		path.pop();
		path.push( e.target.value );
		location.href = `${ location.origin }/${ path.join( "/" ) }`;
	}

} )();
