"use strict";

MZRUI.$setTemplate( "mzrui-popup", () =>
	MZRUI.$createElement( "div", { class: "mzruiPopup-window", tabindex: 0 },
		MZRUI.$createElement( "div", { class: "mzruiPopup-head" } ),
		MZRUI.$createElement( "form", { class: "mzruiPopup-body" },
			MZRUI.$createElement( "div", { class: "mzruiPopup-content" } ),
			MZRUI.$createElement( "div", { class: "mzruiPopup-message" } ),
			MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", type: "text" } ),
			MZRUI.$createElement( "div", { class: "mzruiPopup-btns" },
				MZRUI.$createElement( "input", { type: "button", class: "mzruiPopup-cancel", value: "Cancel" } ),
				MZRUI.$createElement( "input", { type: "submit", class: "mzruiPopup-ok", value: "Ok" } ),
			),
		),
	)
);
