"use strict";

MZRUI.$setTemplate( "mzrui-channels", () => [
	MZRUI.$createElement( "div", { class: "mzruiChannels-panMain" } ),
	MZRUI.$createElement( "div", { class: "mzruiChannels-panChannels" },
		MZRUI.$createElement( "button", { class: "mzruiChannels-addChan" },
			MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "plus" } ),
		),
	),
] );

MZRUI.$setTemplate( "mzrui-channels-selectPopup", () =>
	MZRUI.$createElement( "div", null,
		MZRUI.$createElement( "fieldset", null,
			MZRUI.$createElement( "legend", null, "Select a channel" ),
			MZRUI.$createElement( "select", { name: "channel", size: 8 } ),
		),
	)
);
