"use strict";

MZRUI.$setTemplate( "mzrui-envelope", () => {
	return [
		MZRUI.$createElement( "div", { class: "mzruiEnvelope-head" },
			MZRUI.$createElement( "label", { class: "mzruiEnvelope-toggle", title: "Toggle envelope" },
				MZRUI.$createElement( "input", { class: "mzruiEnvelope-toggleCheckbox", name: "mzruiEnvelope-toggle", type: "checkbox" } ),
				MZRUI.$createElement( "i", { class: "mzruiEnvelope-toggleIcon mzruiIcon", "data-icon": "toggle" } ),
			),
			MZRUI.$createElement( "span", { class: "mzruiEnvelope-title" }, "env gain" ),
		),
		[
			[ "attack", "attack", "att", 0, 1, .01 ],
			[ "hold", "hold", "hold", 0, 1, .01 ],
			[ "decay", "decay", "dec", 0, 1, .01 ],
			[ "sustain", "sustain", "sus", 0, 1, .01 ],
			[ "release", "release", "rel", 0, 4, .01 ],
		].map( ( [ prop, title, text, min, max, step ] ) =>
			MZRUI.$createElement( "div", { class: `mzruiEnvelope-prop mzruiEnvelope-${ prop }`, title },
				MZRUI.$createElement( "div", { class: "mzruiEnvelope-propLabel" },
					MZRUI.$createElement( "span", null, text ),
					MZRUI.$createElement( "div", { class: "mzruiEnvelope-propValue" } ),
				),
				MZRUI.$createElement( "div", { class: "mzruiEnvelope-propContent" },
					MZRUI.$createElement( "mzrui-slider", { type: "linear-x", disabled: true, min, max, step, "mousemove-size": "800", "data-prop": prop } ),
				),
			)
		),
		MZRUI.$createElement( "div", { class: "mzruiEnvelope-graph" },
			MZRUI.$createElement( "mzrui-beatlines", { coloredbeats: "" } ),
			MZRUI.$createElement( "mzrui-envelope-graph" ),
		),
	].flat( 1 );
} );
