"use strict";

MZRUI.$setTemplate( "mzrui-curves", () =>
	MZRUI.$createElementSVG( "svg", { class: "mzruiCurves-svg", preserveAspectRatio: "none" },
		MZRUI.$createElementSVG( "line", { class: "mzruiCurves-line", "shape-rendering": "crispEdges" } ),
		MZRUI.$createElementSVG( "g", { class: "mzruiCurves-marks" } ),
		MZRUI.$createElementSVG( "g", { class: "mzruiCurves-curves" } ),
	)
);
