"use strict";

MZRUI.$setTemplate( "mzrui-dragline", () =>
	MZRUI.$createElement( "div", { class: "mzruiDragline" },
		MZRUI.$createElement( "div", { class: "mzruiDragline-main" },
			MZRUI.$createElementSVG( "svg", { class: "mzruiDragline-line" },
				MZRUI.$createElementSVG( "polyline" ),
			),
			MZRUI.$createElement( "div", { class: "mzruiDragline-to" } ),
		),
	)
);
