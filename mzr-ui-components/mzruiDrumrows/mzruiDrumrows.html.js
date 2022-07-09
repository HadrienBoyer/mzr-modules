"use strict";

MZRUI.$setTemplate( "mzrui-drumrows", () => [
	MZRUI.$createElement( "div", { class: "mzruiDrumrows-drop" },
		MZRUI.$createElement( "div", { class: "mzruiDrumrows-dropIn" },
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
		),
	),
] );

MZRUI.$setTemplate( "mzrui-drumrow", () =>
	MZRUI.$createElement( "form", { class: "mzruiDrumrow", draggable: "true" },
		MZRUI.$createElement( "div", { class: "mzruiDrumrow-grip" },
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "grip-v" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDrumrow-main" },
			MZRUI.$createElement( "button", { type: "button", class: "mzruiIcon mzruiDrumrow-btnToggle", "data-action": "toggle", "data-icon": "toggle", title: "Toggle the drumrow (right click for solo)" } ),
			MZRUI.$createElement( "button", { type: "button", class: "mzruiIcon mzruiDrumrow-btnProps", "data-action": "props", "data-icon": "drumprops", title: "Expand props panel" } ),
			MZRUI.$createElement( "button", { type: "button", class: "mzruiIcon mzruiDrumrow-btnDelete", "data-action": "delete", "data-icon": "close", title: "Remove the drumrow" } ),
			MZRUI.$createElement( "span", { class: "mzruiDrumrow-name" } ),
			MZRUI.$createElement( "div", { class: "mzruiDrumrow-waveWrap" } ),
			MZRUI.$createElement( "div", { class: "mzruiDrumrow-detune", title: "pitch" },
				MZRUI.$createElement( "mzrui-slider", { type: "linear-y", min: -12, max: 12, step: 1, "mousemove-size": 400, "data-prop": "detune" } ),
			),
			MZRUI.$createElement( "div", { class: "mzruiDrumrow-pan", title: "pan" },
				MZRUI.$createElement( "mzrui-slider", { type: "linear-y", min: -1, max: 1, step: .02, "mousemove-size": 400, "data-prop": "pan" } ),
			),
			MZRUI.$createElement( "div", { class: "mzruiDrumrow-gain", title: "gain" },
				MZRUI.$createElement( "mzrui-slider", { type: "linear-y", min: 0, max: 1, step: .01, "mousemove-size": 400, "data-prop": "gain" } ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDrumrow-props" },
			MZRUI.$createElement( "label", { class: "mzruiDrumrow-prop mzruiDrumrow-propDetune", tabindex: 0 },
				MZRUI.$createElement( "input", { class: "mzruiDrumrow-propRadio", type: "radio", name: "prop", value: "detune" }, "pitch" ),
				MZRUI.$createElement( "span", { class: "mzruiDrumrow-propSpan" }, "pitch" ),
			),
			MZRUI.$createElement( "label", { class: "mzruiDrumrow-prop mzruiDrumrow-propPan", tabindex: 0 },
				MZRUI.$createElement( "input", { class: "mzruiDrumrow-propRadio", type: "radio", name: "prop", value: "pan" }, "pan" ),
				MZRUI.$createElement( "span", { class: "mzruiDrumrow-propSpan" }, "pan" ),
			),
			MZRUI.$createElement( "label", { class: "mzruiDrumrow-prop mzruiDrumrow-propGain", tabindex: 0 },
				MZRUI.$createElement( "input", { class: "mzruiDrumrow-propRadio", type: "radio", name: "prop", value: "gain" }, "gain" ),
				MZRUI.$createElement( "span", { class: "mzruiDrumrow-propSpan" }, "gain" ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDrumrows-drop" },
			MZRUI.$createElement( "div", { class: "mzruiDrumrows-dropIn" },
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-dropdown" } ),
			),
		),
	)
);
