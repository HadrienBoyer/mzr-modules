"use strict";

MZRUI.$setTemplate( "mzrui-channel", () => [
	MZRUI.$createElement( "button", { class: "mzruiChannel-nameWrap" },
		MZRUI.$createElement( "span", { class: "mzruiChannel-name" } ),
	),
	MZRUI.$createElement( "button", { class: "mzruiChannel-delete mzruiIcon", "data-icon": "close", title: "Remove the channel" } ),
	MZRUI.$createElement( "mzrui-analyser" ),
	MZRUI.$createElement( "button", { class: "mzruiChannel-toggle mzruiIcon", "data-icon": "toggle" } ),
	MZRUI.$createElement( "div", { class: "mzruiChannel-pan" },
		MZRUI.$createElement( "mzrui-slider", { type: "circular", min: -1, max: 1, step: .02, "mousemove-size": 800, "stroke-width": 3, "data-prop": "pan" } ),
	),
	MZRUI.$createElement( "div", { class: "mzruiChannel-gain" },
		MZRUI.$createElement( "mzrui-slider", { type: "linear-y", min: 0, max: 1, step: .01, "mousemove-size": 400, "data-prop": "gain" } ),
	),
	MZRUI.$createElement( "button", { class: "mzruiChannel-connect" },
		MZRUI.$createElement( "i", { class: "mzruiChannel-connectA mzruiIcon", "data-icon": "caret-up" } ),
		MZRUI.$createElement( "i", { class: "mzruiChannel-connectB mzruiIcon", "data-icon": "caret-up" } ),
	),
	MZRUI.$createElement( "div", { class: "mzruiChannel-grip mzruiIcon", "data-icon": "grip-h" } ),
] );
