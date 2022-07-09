"use strict";

MZRUI.$setTemplate( "mzrui-daw-popup-auth", () =>
	MZRUI.$createElement( "div", { id: "authPopupContent", class: "mzruiDAW-popup-auth" },
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Sign in" ),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" },
					MZRUI.$createElement( "span", null, "Username" ),
					MZRUI.$createElement( "br" ),
					MZRUI.$createElement( "small", null, "(or email)" ),
				),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", required: true, name: "email", type: "text" } ),
				),
			),
			MZRUI.$createElement( "div", { class: "mzruiPopup-row" },
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-title" }, "Password" ),
				MZRUI.$createElement( "div", { class: "mzruiPopup-row-values" },
					MZRUI.$createElement( "input", { class: "mzruiPopup-inputText", required: true, name: "password", type: "password" } ),
				),
			),
			MZRUI.$createElement( "div", { class: "mzruiDAW-popup-auth-error" } ),
		),
		MZRUI.$createElement( "a", { target: "_blank", rel: "noopener", href: "https://gridsound.com/#/forgotPassword" }, "Forgot password ?" ),
		MZRUI.$createElement( "br" ),
		MZRUI.$createElement( "a", { target: "_blank", rel: "noopener", href: "https://gridsound.com/#/auth" }, "Create a new account" ),
	)
);
