"use strict";

MZRUI.$setTemplate( "mzrui-daw-window-main", () =>
	MZRUI.$createElement( "div", { "data-window": "main" } )
);

MZRUI.$setTemplate( "mzrui-daw-window-piano", () =>
	MZRUI.$createElement( "div", { "data-window": "piano" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-winMenu" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "pianoroll" } ),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-window-synth", () =>
	MZRUI.$createElement( "div", { "data-window": "synth" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-winMenu" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "synth" } ),
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "arrow-right" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "synthChannel" },
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "mixer" } ),
				MZRUI.$createElement( "span" ),
			),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-window-mixer", () =>
	MZRUI.$createElement( "div", { "data-window": "mixer" } )
);

MZRUI.$setTemplate( "mzrui-daw-window-effects", () =>
	MZRUI.$createElement( "div", { "data-window": "effects" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-winMenu" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "channel" } ),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-window-drums", () =>
	MZRUI.$createElement( "div", { "data-window": "drums" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-winMenu" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "drums" } ),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-window-slicer", () =>
	MZRUI.$createElement( "div", { "data-window": "slicer" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-winMenu" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-winBtn", "data-target": "slices" } ),
		),
	)
);
