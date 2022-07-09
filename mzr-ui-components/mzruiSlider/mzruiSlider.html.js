"use strict";

MZRUI.$setTemplate( "mzrui-slider", () => [
	MZRUI.$createElement( "input", { type: "range", class: "mzruiSlider-input" } ),
	MZRUI.$createElement( "div", { class: "mzruiSlider-line" },
		MZRUI.$createElement( "div", { class: "mzruiSlider-lineColor" } ),
	),
	MZRUI.$createElementSVG( "svg", { class: "mzruiSlider-svg" },
		MZRUI.$createElementSVG( "circle", { class: "mzruiSlider-svgLine" } ),
		MZRUI.$createElementSVG( "circle", { class: "mzruiSlider-svgLineColor" } ),
	),
	MZRUI.$createElement( "div", { class: "mzruiSlider-eventCatcher" } ),
] );
