"use strict";

MZRUI.$setTemplate( "mzrui-pianoroll-block", () =>
	MZRUI.$createElement( "div", { class: "mzruiBlocksManager-block mzruiPianoroll-block", "data-action": "move" },
		MZRUI.$createElement( "div", { class: "mzruiDragline-drop" } ),
		MZRUI.$createElement( "div", { class: "mzruiBlocksManager-block-crop mzruiBlocksManager-block-cropB", "data-action": "cropB" } ),
	)
);
