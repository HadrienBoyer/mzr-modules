"use strict";

MZRUI.$setTemplate( "mzrui-daw", () => [
	MZRUI.$createElement( "div", { class: "mzruiDAW-head" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaUser" },
			MZRUI.$createElement( "span",   { class: "mzruiDAW-title" }, "MozaRythm" ),
			MZRUI.$createElement( "a",      { class: "mzruiDAW-btn", "data-action": "profile", href: true, title: "Cloud profile", target: "_blank", rel: "noopener" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBig mzruiIcon", "data-action": "login",  "data-icon": "profile", title: "Login to MozaRythm" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBig mzruiIcon", "data-action": "logout", "data-icon": "logout",  title: "Logout" } ),
			MZRUI.$createElement( "div", { class: "mzruiDAW-cmps" },
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-dropdown-btn mzruiDAW-btnBig mzruiDAW-btnColor mzruiIcon", "data-action": "cmps", "data-icon": "musics", title: "Create cloud/local compositions" } ),
				MZRUI.$getTemplate( "mzrui-daw-cmps" ),
				MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-backdrop" } ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaSave mzruiDAW-btns" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnColor mzruiDAW-currCmp-saveBtn mzruiIcon", "data-action": "cmp-save", title: "Save composition" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-currCmp-editBtn", "data-action": "cmp-rename", title: "Edit composition's title" },
				MZRUI.$createElement( "i",    { class: "mzruiDAW-currCmp-localIcon mzruiIcon" } ),
				MZRUI.$createElement( "span", { class: "mzruiDAW-currCmp-name" } ),
				MZRUI.$createElement( "i",    { class: "mzruiDAW-currCmp-editIcon mzruiIcon", "data-icon": "pen" } ),
				MZRUI.$createElement( "span", { class: "mzruiDAW-currCmp-dur" } ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaCtrl" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-volume", title: "Main app volume (this will not affect the rendering)" },
				MZRUI.$createElement( "mzrui-slider", { "data-action": "volume", type: "linear-y", min: 0, max: 1, step: .01, "mousemove-size": 150 } ),
			),
			MZRUI.$createElement( "div", { class: "mzruiDAW-btns mzruiDAW-playPauseStop" },
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-focusBtn", "data-action": "focusSwitch", "data-dir": "up", title: "Toggle focus between the composition and piano windows" },
					MZRUI.$createElement( "span" ),
					MZRUI.$createElement( "span" ),
				),
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "play",  "data-icon": "play" } ),
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "stop",  "data-icon": "stop" } ),
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "reset", "data-icon": "sync", title: "Restart the audio engine" } ),
			),
			MZRUI.$createElement( "mzrui-clock" ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-tempo", "data-action": "tempo", title: "Edit the time signature and BPM" },
				MZRUI.$createElement( "div", { class: "mzruiDAW-tempo-timeDivision" },
					MZRUI.$createElement( "span", { class: "mzruiDAW-tempo-beatsPerMeasure" } ),
					MZRUI.$createElement( "span", { class: "mzruiDAW-tempo-stepsPerBeat" } ),
				),
				MZRUI.$createElement( "span", { class: "mzruiDAW-tempo-bpm" } ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaTime" },
			MZRUI.$createElement( "mzrui-slider", { "data-action": "currentTime", type: "linear-x", min: 0, step: .01 } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaHist" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-btns mzruiDAW-history" },
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon",                      "data-action": "undo",     "data-icon": "undo",       title: "Undo the previous action" } ),
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon",                      "data-action": "redo",     "data-icon": "redo",       title: "Redo the last action" } ),
				MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-dropdown-btn mzruiIcon", "data-action": "undoMore", "data-icon": "caret-down", title: "Show the actions list" } ),
				MZRUI.$getTemplate( "mzrui-daw-history" ),
				MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-backdrop" } ),
			),
			MZRUI.$createElement( "mzrui-spectrum" ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiDAW-btnColor mzruiIcon", "data-action": "export",   "data-icon": "export",   title: "Export the composition" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon",                  "data-action": "settings", "data-icon": "settings", title: "Settings" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaWins mzruiDAW-btns" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "mixer",      "data-win": "mixer",   title: "Open/close the mixer window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "music",      "data-win": "main",    title: "Open/close the composition window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "oscillator", "data-win": "synth",   title: "Open/close the synthesizer window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "drums",      "data-win": "drums",   title: "Open/close the drums window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "keys",       "data-win": "piano",   title: "Open/close the piano window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "slices",     "data-win": "slicer",  title: "Open/close the slices window" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiIcon", "data-action": "window", "data-icon": "effects",    "data-win": "effects", title: "Open/close the effects window" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaHelp" },
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon",                  "data-action": "cookies",   "data-icon": "cookie",    title: "Cookies" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon",                  "data-action": "shortcuts", "data-icon": "keyboard",  title: "Keyboard shortcuts" } ),
			MZRUI.$createElement( "a",      { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon",                  "data-action": "help",      "data-icon": "help",      title: "Help",      href: "https://github.com/mozarythm/daw/wiki/help",      target: "_blank", rel: "noopener" } ),
			MZRUI.$createElement( "a",      { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon",                  "data-action": "changelog", "data-icon": "changelog", title: "Changelog", href: "https://github.com/mozarythm/daw/wiki/changelog", target: "_blank", rel: "noopener" } ),
			MZRUI.$createElement( "button", { class: "mzruiDAW-btn mzruiDAW-btnBg mzruiIcon mzruiDAW-btnColor", "data-action": "about",     "data-icon": "about",     title: "About" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-area mzruiDAW-areaVers" },
			MZRUI.$createElement( "a", { class: "mzruiDAW-btn mzruiDAW-version", "data-action": "version", title: "Access older versions", href: "https://github.com/mozarythm/daw/wiki/versions", target: "_blank", rel: "noopener" },
				MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "list" } ),
				MZRUI.$createElement( "span", { class: "mzruiDAW-version-num" } ),
			),
		),
	),
	MZRUI.$createElement( "mzrui-panels", { class: "mzruiDAW-body mzruiPanels-x" },
		MZRUI.$createElement( "div", { class: "mzruiDAW-patterns" } ),
		MZRUI.$createElement( "div", { class: "mzruiDAW-windows" } ),
	)
] );

MZRUI.$setTemplate( "mzrui-daw-cmps", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown", tabindex: 0 },
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-head", "data-list": "local" },
			MZRUI.$createElement( "i", { class: "mzruiDAW-dropdown-icon mzruiIcon", "data-icon": "local" } ),
			MZRUI.$createElement( "span", { class: "mzruiDAW-dropdown-title" }, "local" ),
			MZRUI.$getTemplate( "mzrui-daw-cmps-btn", { action: "localNewCmp", icon: "plus", text: "new", title: "Create a new composition on this computer" } ),
			MZRUI.$getTemplate( "mzrui-daw-cmps-btn", { action: "localOpenCmp", icon: "folder-open", text: "open", title: "Open a composition on this computer" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-head", "data-list": "cloud" },
			MZRUI.$createElement( "i", { class: "mzruiDAW-dropdown-icon mzruiIcon", "data-icon": "cloud" } ),
			MZRUI.$createElement( "span", { class: "mzruiDAW-dropdown-title" }, "cloud" ),
			MZRUI.$getTemplate( "mzrui-daw-cmps-btn", { action: "cloudNewCmp", icon: "plus", text: "new", title: "Create a new composition on your cloud profile" } ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-list", "data-list": "local" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-placeholder" },
				MZRUI.$createElement( "span", null, "there is no local composition here" ),
			),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-list", "data-list": "cloud" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-placeholder" },
				MZRUI.$createElement( "span", null, "you don't have any cloud composition yet" ),
				MZRUI.$createElement( "span", null, "you are not connected" ),
			),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-cmps-btn", ( { action, title, icon, text } ) =>
	MZRUI.$createElement( "button", { class: "mzruiDAW-cmps-btn", "data-action": action, title },
		MZRUI.$createElement( "i", { class: "mzruiDAW-cmps-btn-icon mzruiIcon", "data-icon": icon } ),
		MZRUI.$createElement( "span", { class: "mzruiDAW-cmps-btn-text" }, text ),
	)
);

MZRUI.$setTemplate( "mzrui-daw-cmp", ( { id, saveMode } ) =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-cmp", "data-id": id, draggable: "true", tabindex: 0 },
		MZRUI.$createElement( "button", { class: "mzruiDAW-cmp-btn mzruiIcon", "data-action": "cmp-save", "data-icon": saveMode === "local" ? "save" : "upload" } ),
		MZRUI.$createElement( "a", { href: true, class: "mzruiDAW-cmp-info", "data-action": "cmp-open" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-cmp-name" } ),
			MZRUI.$createElement( "div", null,
				MZRUI.$createElement( "span", { class: "mzruiDAW-cmp-duration-wrap" },
					MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "clock" } ),
					MZRUI.$createElement( "span", { class: "mzruiDAW-cmp-duration" } ),
				),
				MZRUI.$createElement( "span", { class: "mzruiDAW-cmp-bpm-wrap" },
					MZRUI.$createElement( "i", { class: "mzruiIcon", "data-icon": "speed" } ),
					MZRUI.$createElement( "span", { class: "mzruiDAW-cmp-bpm" } ),
				),
			),
		),
		MZRUI.$createElement( "a", { href: true, class: "mzruiDAW-cmp-btn mzruiDAW-cmp-btn-light mzruiIcon", "data-action": "cmp-json",   "data-icon": "file-export", title: "Export to JSON file" } ),
		MZRUI.$createElement( "button", {        class: "mzruiDAW-cmp-btn mzruiDAW-cmp-btn-light mzruiIcon", "data-action": "cmp-delete", "data-icon": "minus-oct", title: "Delete" } ),
	)
);

MZRUI.$setTemplate( "mzrui-daw-history", () =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown", tabindex: 0 },
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-head" },
			MZRUI.$createElement( "i", { class: "mzruiDAW-dropdown-icon mzruiIcon", "data-icon": "history" } ),
			MZRUI.$createElement( "span", { class: "mzruiDAW-dropdown-title" }, "history" ),
		),
		MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-list" },
			MZRUI.$createElement( "div", { class: "mzruiDAW-dropdown-placeholder" },
				MZRUI.$createElement( "span", null, "there is nothing to undo" ),
			),
		),
	)
);

MZRUI.$setTemplate( "mzrui-daw-history-action", ( { icon, desc, index } ) =>
	MZRUI.$createElement( "div", { class: "mzruiDAW-history-action", "data-action": "historyAction", "data-index": index },
		MZRUI.$createElement( "i", { class: "mzruiDAW-history-action-icon mzruiIcon", "data-icon": icon } ),
		MZRUI.$createElement( "span", { class: "mzruiDAW-history-action-text" }, desc ),
	)
);
