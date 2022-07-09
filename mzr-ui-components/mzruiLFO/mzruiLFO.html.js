"use strict";

MZRUI.$setTemplate( "mzrui-lfo", () => {
	return [
		MZRUI.$createElement( "div", { class: "mzruiLFO-head" },
			MZRUI.$createElement( "label", { class: "mzruiLFO-btn mzruiLFO-toggle", title: "Toggle LFO" },
				MZRUI.$createElement( "input", { class: "mzruiLFO-btnInput mzruiLFO-toggleCheckbox", name: "mzruiLFO-toggle", type: "checkbox" } ),
				MZRUI.$createElement( "i", { class: "mzruiLFO-btnIcon mzruiLFO-toggleIcon mzruiIcon", "data-icon": "toggle" } ),
			),
			MZRUI.$createElement( "span", { class: "mzruiLFO-title" }, "LFO ..." ),
		),
		MZRUI.$createElement( "div", { class: "mzruiLFO-graph" },
			MZRUI.$createElement( "div", { class: "mzruiLFO-wave" },
				MZRUI.$createElement( "mzrui-beatlines", { coloredbeats: "" } ),
				MZRUI.$createElement( "mzrui-periodicwave" ),
			),
			MZRUI.$createElement( "div", { class: "mzruiLFO-ampSigns" },
				MZRUI.$createElement( "label", { class: "mzruiLFO-btn mzruiLFO-ampSign" },
					MZRUI.$createElement( "input", { class: "mzruiLFO-btnInput mzruiLFO-ampSignRadio", name: "mzruiLFO-ampSign", type: "radio", value: "1" } ),
					MZRUI.$createElement( "i", { class: "mzruiLFO-btnIcon mzruiLFO-ampSignIcon mzruiIcon", "data-icon": "caret-up" } ),
				),
				MZRUI.$createElement( "label", { class: "mzruiLFO-btn mzruiLFO-ampSign" },
					MZRUI.$createElement( "input", { class: "mzruiLFO-btnInput mzruiLFO-ampSignRadio", name: "mzruiLFO-ampSign", type: "radio", value: "-1" } ),
					MZRUI.$createElement( "i", { class: "mzruiLFO-btnIcon mzruiLFO-ampSignIcon mzruiIcon", "data-icon": "caret-down" } ),
				),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiLFO-lowpassGraph" } ),
		[
			[ "delay", "delay", "del", 0, 4, .03125 ],
			[ "attack", "attack", "att", 0, 4, .03125 ],
			[ "speed", "speed", "spd", .25, 18, .125 ],
			[ "amp", "amplitude", "amp", .001, 1, .001 ],
			[ "lowpassfreq", "lowpass frequency", "LP", 0, 1, .001 ],
		].map( ( [ prop, title, text, min, max, step ] ) =>
			MZRUI.$createElement( "div", { class: `mzruiLFO-prop mzruiLFO-${ prop }`, title },
				MZRUI.$createElement( "div", { class: "mzruiLFO-propLabel" },
					MZRUI.$createElement( "span", null, text ),
					MZRUI.$createElement( "div", { class: "mzruiLFO-propValue" } ),
				),
				MZRUI.$createElement( "div", { class: "mzruiLFO-propContent" },
					MZRUI.$createElement( "mzrui-slider", { type: "linear-x", disabled: true, min, max, step, "mousemove-size": "800", "data-prop": prop } ),
				),
			)
		),
		MZRUI.$createElement( "div", { class: "mzruiLFO-prop mzruiLFO-type" },
			MZRUI.$createElement( "div", { class: "mzruiLFO-propLabel" }, "wave" ),
			MZRUI.$createElement( "div", { class: "mzruiLFO-propContent" },
				[
					[ "sine", "M 1 5 C 1 4 1 1 4 1 C 7 1 7 4 7 5 C 7 6 7 9 10 9 C 13 9 13 6 13 5" ],
					[ "triangle", "M 1 5 L 4 1 L 10 9 L 13 5" ],
					[ "sawtooth", "M 1 5 L 7 1 L 7 9 L 13 5" ],
					[ "square", "M 1 5 L 1 1 L 7 1 L 7 9 L 13 9 L 13 5" ],
				].map( ( [ w, dots ] ) =>
					MZRUI.$createElement( "label", { class: "mzruiLFO-btn mzruiLFO-typeBtn", title: w },
						MZRUI.$createElement( "input", { class: "mzruiLFO-btnInput mzruiLFO-typeRadio", name: "mzruiLFO-type", type: "radio", value: w } ),
						MZRUI.$createElementSVG( "svg", { class: "mzruiLFO-btnIcon mzruiLFO-typeSVG", viewBox: "0 0 14 10" }, MZRUI.$createElementSVG( "path", { d: dots } ) ),
					)
				)
			),
		),
	].flat( 1 );
} );
