"use strict";

MZRUI.$setTemplate( "mzrui-daw-popup-open", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-popup-open" },
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Open and load a new composition" ),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" }, "With an URL" ),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", name: "url", type: "url", placeholder: "https://" } ),
				),
			),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" },
					"With a local file",
					MZRUI.$createElement( "br" ),
					MZRUI.$createElement( "small", null, "(Please notice that you can also drop a file into the app)" ),
				),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { name: "file", type: "file" } ),
				),
			),
		),
	)
);
