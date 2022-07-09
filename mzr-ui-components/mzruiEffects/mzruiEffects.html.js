"use strict";

MZRUI.$setTemplate( "mzrui-effects", () =>
	MZRUI.$createElement( "div", { class: "mzruiEffects-list" },
		MZRUI.$createElement( "button", { class: "mzruiEffects-addBtn" },
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "plus" } ),
		),
		MZRUI.$createElement( "select", { class: "mzruiEffects-addSelect", size: 4 } ),
	)
);

MZRUI.$setTemplate( "mzrui-effects-fx", () =>
	MZRUI.$createElement( "div", { class: "mzruiEffects-fx", draggable: "true" },
		MZRUI.$createElement( "div", { class: "mzruiEffects-fx-head" },
			MZRUI.$createElement( "div", { class: "mzruiEffects-fx-grip mzruiIcon", "data-icon": "grip-v" } ),
			MZRUI.$createElement( "button", { class: "mzruiEffects-fx-expand mzruiIcon", "data-icon": "caret-right" } ),
			MZRUI.$createElement( "button", { class: "mzruiEffects-fx-toggle mzruiIcon", "data-icon": "toggle", title: "Toggle this effect" } ),
			MZRUI.$createElement( "span", { class: "mzruiEffects-fx-name" } ),
			MZRUI.$createElement( "button", { class: "mzruiEffects-fx-remove mzruiIcon", "data-icon": "close", title: "Delete this effect" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiEffects-fx-content" } ),
	)
);
