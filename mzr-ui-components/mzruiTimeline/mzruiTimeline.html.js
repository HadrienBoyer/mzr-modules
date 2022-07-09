"use strict";

MZRUI.$setTemplate( "mzrui-timeline", () => [
	MZRUI.$createElement( "div", { class: "mzruiTimeline-steps" } ),
	MZRUI.$createElement( "div", { class: "mzruiTimeline-beats" } ),
	MZRUI.$createElement( "div", { class: "mzruiTimeline-measures" } ),
	MZRUI.$createElement( "div", { class: "mzruiTimeline-loopLine" },
		MZRUI.$createElement( "div", { class: "mzruiTimeline-loop" },
			MZRUI.$createElement( "div", { class: "mzruiTimeline-loopBody" } ),
			MZRUI.$createElement( "div", { class: "mzruiTimeline-loopHandle mzruiTimeline-loopHandleA" } ),
			MZRUI.$createElement( "div", { class: "mzruiTimeline-loopBorder mzruiTimeline-loopBorderA" } ),
			MZRUI.$createElement( "div", { class: "mzruiTimeline-loopHandle mzruiTimeline-loopHandleB" } ),
			MZRUI.$createElement( "div", { class: "mzruiTimeline-loopBorder mzruiTimeline-loopBorderB" } ),
		),
	),
	MZRUI.$createElement( "div", { class: "mzruiTimeline-timeLine" },
		MZRUI.$createElementSVG( "svg", { class: "mzruiTimeline-cursor", width: "16", height: "10" },
			MZRUI.$createElementSVG( "polygon", { points: "2,2 8,8 14,2" } ),
		),
		MZRUI.$createElementSVG( "svg", { class: "mzruiTimeline-cursorPreview", width: "16", height: "10" },
			MZRUI.$createElementSVG( "polygon", { points: "2,2 8,8 14,2" } ),
		),
	),
] );
