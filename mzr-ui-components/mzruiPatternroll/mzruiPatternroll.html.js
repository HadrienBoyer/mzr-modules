"use strict";

MZRUI.$setTemplate( "mzrui-patternroll-block", () =>
	MZRUI.$createElement( "div", { class: "mzruiBlocksManager-block mzruiPatternroll-block", "data-action": "move" },
		MZRUI.$createElement( "div", { class: "mzruiBlocksManager-block-crop mzruiBlocksManager-block-cropA", "data-action": "cropA" } ),
		MZRUI.$createElement( "div", { class: "mzruiBlocksManager-block-crop mzruiBlocksManager-block-cropB", "data-action": "cropB" } ),
		MZRUI.$createElement( "div", { class: "mzruiPatternroll-block-header" },
			MZRUI.$createElement( "span", { class: "mzruiPatternroll-block-name" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiPatternroll-block-content" } ),
		MZRUI.$createElement( "div", { class: "mzruiPatternroll-block-placeholder" },
			MZRUI.$createElement( "i", { class: "mzruiPatternroll-block-placeholderIcon mzruiIcon", "data-icon": "file-corrupt" } ),
			MZRUI.$createElement( "span", { class: "mzruiPatternroll-block-placeholderText" }, "missing data" ),
		),
	)
);
