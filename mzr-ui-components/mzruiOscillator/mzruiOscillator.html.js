"use strict";

MZRUI.$setTemplate( "mzrui-oscillator", () => {
	return [
		MZRUI.$createElement( "div", { class: "mzruiOscillator-grip mzruiIcon", "data-icon": "grip-v" } ),
		MZRUI.$createElement( "div", { class: "mzruiOscillator-wave" },
			MZRUI.$createElement( "mzrui-periodicwave" ),
			MZRUI.$createElement( "mzrui-periodicwave" ),
		),
		MZRUI.$createElement( "button", { class: "mzruiOscillator-waveBtn mzruiOscillator-wavePrev mzruiIcon", "data-icon": "caret-left", title: "Previous wave" } ),
		MZRUI.$createElement( "button", { class: "mzruiOscillator-waveBtn mzruiOscillator-waveNext mzruiIcon", "data-icon": "caret-right", title: "Next wave" } ),
		MZRUI.$createElement( "select", { class: "mzruiOscillator-waveSelect" },
			[ "sine", "triangle", "sawtooth", "square" ].map( w =>
				MZRUI.$createElement( "option", { class: "mzruiOscillator-waveOptNative", value: w }, w )
			)
		),
		[
			[ "detune", "pitch", -24, 24, 1 ],
			[ "pan", "pan", -1, 1, .02 ],
			[ "gain", "gain", 0, 1, .01 ],
		].map( ( [ prop, title, min, max, step ] ) =>
			MZRUI.$createElement( "div", { class: `mzruiOscillator-prop mzruiOscillator-${ prop }`, title },
				MZRUI.$createElement( "div", { class: "mzruiOscillator-sliderWrap" },
					MZRUI.$createElement( "mzrui-slider", { type: "circular", min, max, step, "mousemove-size": "800", "data-prop": prop } )
				),
				MZRUI.$createElement( "div", { class: "mzruiOscillator-sliderValue" } ),
			)
		),
		MZRUI.$createElement( "button", { class: "mzruiOscillator-remove mzruiIcon", "data-icon": "close", title: "Remove the oscillator" } ),
	].flat( 1 );
} );
