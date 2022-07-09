"use strict";

MZRUI.$setTemplate( "mzrui-patterns-pattern", () =>
	MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern", draggable: "true" },
		MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-grip mzruiIcon", "data-icon": "grip-v" } ),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-head" },
			MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-info" },
				MZRUI.$createElement( "button", { class: "mzruiPatterns-pattern-btn mzruiPatterns-pattern-btnInfo mzruiIcon", "data-action": "editInfo", "data-icon": "buf-undefined", title: "Edit buffer's info" } ),
				MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-name" } ),
				MZRUI.$createElement( "i", { class: "mzruiPatterns-destArrow mzruiIcon", "data-icon": "arrow-right" } ),
				MZRUI.$createElement( "button", { class: "mzruiPatterns-btnSolid mzruiPatterns-pattern-dest", "data-action": "redirect", title: "Redirect this pattern" },
					MZRUI.$createElement( "i", { class: "mzruiPatterns-btnIcon mzruiIcon", "data-icon": "mixer" } ),
					MZRUI.$createElement( "span", { class: "mzruiPatterns-btnText" } ),
				),
			),
			MZRUI.$createElement( "button", { class: "mzruiPatterns-pattern-btn mzruiIcon", "data-action": "clone", "data-icon": "clone", title: "Clone this pattern" } ),
			MZRUI.$createElement( "button", { class: "mzruiPatterns-pattern-btn mzruiIcon", "data-action": "remove", "data-icon": "close", title: "Delete this pattern" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-content" } ),
		MZRUI.$createElement( "div", { class: "mzruiPatterns-pattern-placeholder" },
			MZRUI.$createElement( "i", { class: "mzruiPatterns-pattern-placeholderIcon mzruiIcon", "data-icon": "file-corrupt" } ),
			MZRUI.$createElement( "span", { class: "mzruiPatterns-pattern-placeholderText" }, "missing data" ),
		),
	)
);
