"use strict";

MZRUI.$setTemplate( "mzrui-slicer", () => [
	MZRUI.$createElement( "div", { class: "mzruiSlicer-source" },
		MZRUI.$createElement( "div", { class: "mzruiSlicer-source-head" },
			MZRUI.$createElement( "i", { class: "mzruiSlicer-source-icon mzruiIcon", "data-icon": "waveform" } ),
			MZRUI.$createElement( "span", { class: "mzruiSlicer-source-name" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiSlicer-source-sample-wrap" },
			MZRUI.$createElement( "div", { class: "mzruiSlicer-source-sample" },
				MZRUI.$createElementSVG( "svg", { class: "mzruiSlicer-source-wave", viewBox: "0 0 1000 64", preserveAspectRatio: "none" },
					MZRUI.$createElementSVG( "polyline" ),
				),
				MZRUI.$createElement( "div", { class: "mzruiSlicer-currentTime mzruiSlicer-source-currentTime" } ),
			),
		),
	),
	MZRUI.$createElement( "div", { class: "mzruiSlicer-time" },
		MZRUI.$createElement( "mzrui-timeline" ),
	),
	MZRUI.$createElement( "div", { class: "mzruiSlicer-preview" },
		MZRUI.$createElement( "div", { class: "mzruiSlicer-currentTime mzruiSlicer-preview-currentTime" } ),
	),
	MZRUI.$createElement( "div", { class: "mzruiSlicer-slices" },
		MZRUI.$createElement( "div", { class: "mzruiSlicer-slices-scroll" },
			MZRUI.$createElement( "div", { class: "mzruiSlicer-slices-in" },
				MZRUI.$createElement( "div", { class: "mzruiSlicer-slices-beatlinesWrap" },
					MZRUI.$createElement( "mzrui-beatlines" ),
					MZRUI.$createElement( "mzrui-beatlines", { vertical: true } ),
				),
				MZRUI.$createElement( "div", { class: "mzruiSlicer-currentTime mzruiSlicer-slices-currentTime" } ),
				MZRUI.$createElementSVG( "svg", { class: "mzruiSlicer-slices-line", preserveAspectRatio: "none" },
					MZRUI.$createElementSVG( "line" ),
				),
				MZRUI.$createElement( "div", { class: "mzruiSlicer-slices-wrap" } ),
			),
		),
	),
	MZRUI.$createElement( "div", { class: "mzruiSlicer-menu" },
		MZRUI.$createElement( "button", { class: "mzruiSlicer-btn mzruiSlicer-btn-step", title: "Magnetism" },
			MZRUI.$createElement( "span", { class: "mzruiSlicer-btn-step-value" } ),
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "magnet" } ),
		),
		MZRUI.$createElement( "button", { class: "mzruiSlicer-btn mzruiIcon", "data-action": "moveY", "data-icon": "hand-pointer", title: "Move slices vertically" } ),
		MZRUI.$createElement( "button", { class: "mzruiSlicer-btn mzruiIcon", "data-action": "reset", "data-icon": "slices", title: "Reset slices vertically" } ),
		MZRUI.$createElement( "button", { class: "mzruiSlicer-btn mzruiIcon", "data-action": "split", "data-icon": "cut", title: "Cut slices in half" } ),
		MZRUI.$createElement( "button", { class: "mzruiSlicer-btn mzruiIcon", "data-action": "merge", "data-icon": "erase", title: "Merge slices together" } ),
	),
] );