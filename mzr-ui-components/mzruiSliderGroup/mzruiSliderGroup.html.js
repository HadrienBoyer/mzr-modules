"use strict";

MZRUI.$setTemplate( "mzrui-slidergroup", () => {
	return (
		MZRUI.$createElement( "div", { class: "mzruiSliderGroup-slidersWrap" },
			MZRUI.$createElement( "div", { class: "mzruiSliderGroup-sliders" },
				MZRUI.$createElement( "mzrui-beatlines", { coloredbeats: "" } ),
				MZRUI.$createElement( "div", { class: "mzruiSliderGroup-currentTime" } ),
				MZRUI.$createElement( "div", { class: "mzruiSliderGroup-defaultValue" } ),
				MZRUI.$createElement( "div", { class: "mzruiSliderGroup-loop mzruiSliderGroup-loopA" } ),
				MZRUI.$createElement( "div", { class: "mzruiSliderGroup-loop mzruiSliderGroup-loopB" } ),
			),
		)
	);
} );

MZRUI.$setTemplate( "mzrui-slidergroup-slider", () => {
	return (
		MZRUI.$createElement( "div", { class: "mzruiSliderGroup-slider" },
			MZRUI.$createElement( "div", { class: "mzruiSliderGroup-sliderInner" } ),
		)
	);
} );
