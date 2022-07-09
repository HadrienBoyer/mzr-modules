"use strict";

MZRUI.$setTemplate( "mzrui-synthesizer", () => {
	return [
		MZRUI.$createElement( "div", { class: "mzruiSynthesizer-env" }, MZRUI.$createElement( "mzrui-envelope" ) ),
		MZRUI.$createElement( "div", { class: "mzruiSynthesizer-lfo" }, MZRUI.$createElement( "mzrui-lfo" ) ),
		MZRUI.$createElement( "div", { class: "mzruiSynthesizer-head mzruiSynthesizer-headOscs" },
			MZRUI.$createElement( "span", { class: "mzruiSynthesizer-headTitle" }, "oscillators" ),
			MZRUI.$createElement( "span", { class: "mzruiSynthesizer-label mzruiSynthesizer-labelPitch" }, "pitch" ),
			MZRUI.$createElement( "span", { class: "mzruiSynthesizer-label mzruiSynthesizer-labelPan" }, "pan" ),
			MZRUI.$createElement( "span", { class: "mzruiSynthesizer-label mzruiSynthesizer-labelGain" }, "gain" ),
		),
		MZRUI.$createElement( "div", { class: "mzruiSynthesizer-oscList" },
			MZRUI.$createElement( "button", { class: "mzruiSynthesizer-newOsc" },
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "plus" } ),
			),
		),
	];
} );
