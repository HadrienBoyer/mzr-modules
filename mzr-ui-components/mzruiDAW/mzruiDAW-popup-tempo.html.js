"use strict";

MZRUI.$setTemplate( "mzrui-daw-popup-tempo", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-popup-tempo" },
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Time division / BPM" ),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" }, "Beats per measure" ),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", name: "beatsPerMeasure", type: "number", min: 1, max: 16, } ),
				),
			),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" }, "Steps per beat" ),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", name: "stepsPerBeat", type: "number", min: 1, max: 16, } ),
				),
			),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" }, "BPM (Beats Per Minute)" ),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", name: "bpm", type: "number", min: 1, max: 999.99, step: .01 } ),
					MZRUI.$createElement( "a", { class: "mzruiDAW-bpmTap mzruiIcon", "data-icon": "tint" } ),
				),
			),
		),
	)
);
