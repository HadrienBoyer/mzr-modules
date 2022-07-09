"use strict";

MZRUI.$setTemplate( "mzrui-daw-popup-cookies", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-popup-cookies" },
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Render the current composition" ),
			MZRUI.$createElement( "div", null,
				MZRUI.$createElement( "span", null, "Do you accept to let GridSound using Cookies to offers you 3 features :" ),
				MZRUI.$createElement( "ul", null,
					MZRUI.$createElement( "li", null, "Saving compositions locally (localStorage)" ),
					MZRUI.$createElement( "li", null, "Offline mode (serviceWorker)" ),
					MZRUI.$createElement( "li", null, "Connection to GridSound's server" ),
				),
				MZRUI.$createElement( "span", null, "There is no tracker or adverts of any kind on this app." ),
			),
		),
	)
);
