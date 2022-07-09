"use strict";

MZRUI.$setTemplate( "mzrui-patterns-synth", () =>
	MZRUI.$createElement( "div", { class: "mzruiPatterns-synth" },
		MZRUI.$createElement( "div", { class: "mzruiPatterns-synth-head" },
			MZRUI.$createElement( "button", { class: "mzruiPatterns-synth-btn mzruiPatterns-synth-expand mzruiIcon", "data-action": "expand", "data-icon": "caret-right" } ),
			MZRUI.$createElement( "div", { class: "mzruiPatterns-synth-info" },
				MZRUI.$createElement( "div", { class: "mzruiPatterns-synth-name" } ),
				MZRUI.$createElement( "i", { class: "mzruiPatterns-destArrow mzruiIcon", "data-icon": "arrow-right" } ),
				MZRUI.$createElement( "button", { class: "mzruiPatterns-btnSolid mzruiPatterns-synth-dest", "data-action": "redirect", title: "Redirect this synthesizer" },
					MZRUI.$createElement( "i", { class: "mzruiPatterns-btnIcon mzruiIcon", "data-icon": "mixer" } ),
					MZRUI.$createElement( "span", { class: "mzruiPatterns-btnText" } ),
				),
			),
			MZRUI.$createElement( "button", { class: "mzruiPatterns-synth-btn mzruiIcon", "data-action": "newPattern", "data-icon": "plus", title: "Create a new pattern with this synthesizer" } ),
			MZRUI.$createElement( "button", { class: "mzruiPatterns-synth-btn mzruiIcon", "data-action": "delete", "data-icon": "close", title: "Delete the synthesizer and its patterns" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-placeholderToCheck mzruiPatterns-synth-patterns" },
			MZRUI.$createElement( "div", { class: "mzruiPatterns-placeholder" },
				MZRUI.$createElement( "span", null, "this synthesizer has no related pattern" ),
			),
		),
	)
);
