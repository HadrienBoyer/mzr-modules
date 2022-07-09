"use strict";

MZRUI.$setTemplate( "mzrui-track", () => [
	MZRUI.$createElement( "button", { class: "mzruiTrack-toggle mzruiIcon", "data-action": "toggle", "data-icon": "toggle", title: "toggle track" } ),
	MZRUI.$createElement( "div", { class: "mzruiTrack-nameWrap" },
		MZRUI.$createElement( "input", { class: "mzruiTrack-name", "data-action": "rename", type: "text", disabled: "", spellcheck: "false" } ),
	),
] );

MZRUI.$setTemplate( "mzrui-track-row", () =>
	MZRUI.$createElement( "div", { class: "mzruiTrack-row mzrui-row mzrui-mute" },
		MZRUI.$createElement( "div" ),
	)
);
