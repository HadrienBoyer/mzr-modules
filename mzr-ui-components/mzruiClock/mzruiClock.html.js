"use strict";

MZRUI.$setTemplate( "mzrui-clock", () => [
	MZRUI.$createElement( "div", { class: "mzruiClock-relative" },
		MZRUI.$createElement( "div", { class: "mzruiClock-absolute" },
			MZRUI.$createElement( "div", { class: "mzruiClock-a" }, "0" ),
			MZRUI.$createElement( "div", { class: "mzruiClock-b" }, "00" ),
			MZRUI.$createElement( "div", { class: "mzruiClock-c" }, "000" ),
			MZRUI.$createElement( "span", { class: "mzruiClock-modeText" } ),
		),
	),
	MZRUI.$createElement( "button", { class: "mzruiClock-modes" },
		MZRUI.$createElement( "div", { class: "mzruiClock-mode mzruiClock-beat" } ),
		MZRUI.$createElement( "div", { class: "mzruiClock-mode mzruiClock-second" } ),
	)
] );
