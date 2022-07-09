"use strict";

MZRUI.$setTemplate( "mzrui-daw-popup-export", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-popup-export" },
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Render the current composition" ),
			MZRUI.$createElement( "div", { class: "mzruiDAW-popup-export-wrap" },
				MZRUI.$createElement( "a", { href: true, class: "mzruiDAW-popup-export-btn", "data-status": 0 },
					MZRUI.$createElement( "span", { class: "mzruiDAW-popup-export-btn0" },
						MZRUI.$createElement( "span", null, "Render" ),
						MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "render" } ),
					),
					MZRUI.$createElement( "span", { class: "mzruiDAW-popup-export-btn1" },
						MZRUI.$createElement( "span", null, "Rendering..." ),
						MZRUI.$createElement( "i", { class: "mzruiIcon", "data-spin": "on" } ),
					),
					MZRUI.$createElement( "span", { class: "mzruiDAW-popup-export-btn2" },
						MZRUI.$createElement( "span", null, "Download WAV file" ),
						MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "export" } ),
					),
				),
				MZRUI.$createElement( "progress", { class: "mzruiDAW-popup-export-progress", value: "", max: 1 } ),
			),
		),
	)
);
