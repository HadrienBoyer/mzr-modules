"use strict";

MZRUI.$setTemplate( "mzrui-patterns", () =>
	MZRUI.$createElement( "mzrui-panels", { class: "mzruiPanels-y" },
		MZRUI.$getTemplate( "mzrui-patterns-panel", {
			class: "Buffers",
			title: "buffers",
			icon: "waveform",
			placeholder: "drag 'n drop raw files here (mp3, ogg, wav)",
		} ),
		MZRUI.$getTemplate( "mzrui-patterns-panel", {
			class: "Slices",
			title: "slices",
			icon: "slices",
			placeholder: "no slices yet",
			button: { action: "newSlices", title: "Create a new slices pattern", txt: "new slices" },
		} ),
		MZRUI.$getTemplate( "mzrui-patterns-panel", {
			class: "Drums",
			title: "drums",
			icon: "drums",
			placeholder: "no drums yet",
			button: { action: "newDrums", title: "Create a new drums pattern", txt: "new drums" },
		} ),
		MZRUI.$getTemplate( "mzrui-patterns-panel", {
			class: "Keys",
			title: "keys",
			icon: "oscillator",
			placeholder: "no synth yet",
			button: { action: "newSynth", title: "Create a new synthesizer", txt: "new synth" },
		} ),
	)
);

MZRUI.$setTemplate( "mzrui-patterns-panel", obj =>
	MZRUI.$createElement( "div", { class: `mzruiPatterns-panel mzruiPatterns-panel${ obj.class }` },
		MZRUI.$createElement( "div", { class: "mzruiPatterns-panel-menu" },
			MZRUI.$createElement( "i", { class: "mzruiPatterns-panel-icon mzruiIcon", "data-icon": obj.icon } ),
			MZRUI.$createElement( "span", { class: "mzruiPatterns-panel-title" }, obj.title ),
			obj.button &&
				MZRUI.$createElement( "button", { class: "mzruiPatterns-btnSolid", "data-action": obj.button.action, title: obj.button.title },
					MZRUI.$createElement( "i", { class: "mzruiPatterns-btnIcon mzruiIcon", "data-icon": "plus" } ),
					MZRUI.$createElement( "span", { class: "mzruiPatterns-btnText" }, obj.button.txt ),
				),
		),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-placeholderToCheck mzruiPatterns-panel-list" } ),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-placeholder" },
			MZRUI.$createElement( "span", null, obj.placeholder ),
		),
	)
);
