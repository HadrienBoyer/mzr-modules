"use strict";

MZRUI.$setTemplate( "mzrui-drums-line", () =>
	MZRUI.$createElement( "div", { class: "mzruiDrums-line" },
		MZRUI.$createElement( "div", { class: "mzruiDrums-lineDrums" },
			MZRUI.$createElement( "div", { class: "mzruiDrums-lineIn" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDrums-lineProps" },
			MZRUI.$createElement( "mzrui-slidergroup" ),
		),
	)
);

MZRUI.$setTemplate( "mzrui-drums-drum", () =>
	MZRUI.$createElement( "div", { class: "mzruiDrums-drum" },
		MZRUI.$createElement( "div", { class: "mzruiDrums-drumIn" },
			[ "detune", "pan", "gain" ].map( p =>
				MZRUI.$createElement( "div", { class: "mzruiDrums-drumProp", "data-value": p },
					MZRUI.$createElement( "div", { class: "mzruiDrums-drumPropValue" } ),
				)
			),
		),
	)
);

MZRUI.$setTemplate( "mzrui-drums-drumcut", () =>
	MZRUI.$createElement( "div", { class: "mzruiDrums-drumcut" },
		MZRUI.$createElement( "div", { class: "mzruiDrums-drumcutIn" },
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "drumcut" } ),
		),
	)
);
