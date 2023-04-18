/** 
 * If false, Show browser's native menu when no custom menu is specified.
 */
let forceCustomMenu = true;

/**
 * The default menu to display when no menu is specified.
 */
let defaultMenu = [
	{
		text: "Refresh",
		shortcut: "f5",
		icon: "url('https://img.icons8.com/material-outlined/32/recurring-appointment.png')",
		handle: function () {
			location.reload();
		},
	},
	{
		text: "Disabled item",
		disabled: true,
	},
	{
		text: "Go to...",
		close: false,
		submenu: [
			{
				text: "Google",
				icon: "url('https://img.icons8.com/material-outlined/32/google-logo.png')",
				handle: function () {
					location.href = "https://www.google.com";
				},
			},
			{
				text: "Youtube",
				icon: "url('https://img.icons8.com/material-outlined/32/youtube.png')",
				handle: function () {
					location.href = "https://www.youtube.com";
				},
			},
			{
				text: "Facebook",
				icon: "url('https://img.icons8.com/material-outlined/32/facebook.png')",
				handle: function () {
					location.href = "https://www.facebook.com";
				},
			},
		],
	},
];

/**
 * List of menus to refrence.
 */
let menus = {
	list: [
		...defaultMenu,
		{ separator: true },
		{ header: true, text: "Actions" },
		{
			text: "Add",
			handle: function (target) {
				const newItem = document.createElement("button");
				newItem.innerText = "Item" + target.childElementCount;
				newItem.setAttribute("data-context-menu", "item");
				target.appendChild(newItem);
			},
		},
	],
	item: [
		...defaultMenu,
		{ separator: true },
		{
			header: true,
			text: "Actions",
			load: function (item, target) {
				item.innerText = target.innerText + " Actions";
			},
		},
		{
			text: "Add",
			handle: function (target) {
				const newItem = document.createElement("button");
				newItem.innerText = "Item" + target.parentElement.childElementCount;
				newItem.setAttribute("data-context-menu", "item");
				target.parentElement.appendChild(newItem);
			},
		},
		{
			text: "Delete",
			close: true,
			handle: function (target) {
				target.remove();
			},
		},
	],
	input: [
		{ header: true, text: "Text Editing" },
		{
			text: "Words",
			close: false,
			submenu: [
				{
					text: "Greetings",
					close: false,
					submenu: [
						{
							text: "hello",
							handle: function (target) {
								target.value += this.text;
							},
						},
						{
							text: "hi",
							handle: function (target) {
								target.value += this.text;
							},
						},
						{
							text: "welcome",
							handle: function (target) {
								target.value += this.text;
							},
						},
						{
							text: "howdy",
							handle: function (target) {
								target.value += this.text;
							},
						},
					],
				},
				{
					text: "Names",
					close: false,
					submenu: [
						{
							text: "Ahmad",
							handle: function (target) {
								target.value += " " + this.text;
							},
						},
						{
							text: "Mohammed",
							handle: function (target) {
								target.value += " " + this.text;
							},
						},
						{
							text: "Mariam",
							handle: function (target) {
								target.value += " " + this.text;
							},
						},
						{
							text: "Hamza",
							handle: function (target) {
								target.value += " " + this.text;
							},
						},
					],
				},
			],
		},
		{
			text: "Clear",
			handle: function (target) {
				target.value = "";
			},
		},
		{
			text: "Copy",
			shortcut: "ctrl+C",
			handle: function (target) {
				navigator.clipboard.writeText(target.value);
			},
		},
		{
			text: "Paste",
			shortcut: "ctrl+V",
			handle: function (target) {
				navigator.clipboard.readText().then((clipText) => (target.value += clipText));
			},
		},
	],
};

/**
 * Adds a new context menu
 * @param {Element} target The target element, required
 * @param {Number} x X position of the menu
 * @param {Number} y Y position of the menu
 * @param {Array} customMenu The menu to force-use
 */
function contextMenu(target, x, y, customMenu) {
	document.getElementsByClassName("context-menu")[0]?.remove();

	const mainMenu = document.createElement("ul");
	mainMenu.tabIndex = 0;
	mainMenu.classList.add("menu");
	mainMenu.classList.add("context-menu");
	const rect = target.getBoundingClientRect();
	mainMenu.style.left = (x ?? rect.x) + "px";
	mainMenu.style.top = (y ?? rect.y) + "px";
	const blur = function () {
		setTimeout(() => {
			if (!mainMenu.matches(":focus-within")) {
				mainMenu.remove();
			}
		});
	};

	const menuitems = customMenu ?? menus[target.getAttribute("data-context-menu")] ?? defaultMenu;

	function recursiveMenu(menu, items) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.separator == true) {
				const hr = document.createElement("hr");
				menu.appendChild(hr);
				continue;
			}
			const menuitem = document.createElement("li");
			menuitem.innerText = item.text;
			menuitem.classList.add("menu-item");

			if (item.shortcut) {
				const shortcut = document.createElement("span");
				shortcut.innerText = item.shortcut;
				shortcut.classList.add("menu-shortcut");
				menuitem.appendChild(shortcut);
			}

			if (item.header == true) {
				menuitem.classList.add("header");
			}
			if (item.icon) {
				menuitem.style.setProperty("--icon", item.icon);
			}
			if (item.disabled == true) {
				menuitem.classList.add("disabled");
				menuitem.inert = true;
			}
			if (!item.disabled) {
				menuitem.tabIndex = 0;
				const handle = function (evt) {
					if (item.handle) {
						item.handle(target);
					}
					if (item.close != false && !item.submenu && !item.header) {
						mainMenu.remove();
					}
				};
				menuitem.addEventListener("click", handle);
				menuitem.addEventListener("keydown", function (evt) {
					if (evt.code == "Space" || evt.code == "Enter") {
						handle();
					}
				});
				menuitem.addEventListener("blur", blur);
			}
			if (item.submenu) {
				const submenu = document.createElement("ul");
				submenu.classList.add("menu");
				recursiveMenu(submenu, item.submenu);
				menuitem.appendChild(submenu);
			}

			menu.appendChild(menuitem);

			if (item.load) {
				item.load(menuitem, target);
			}
		}
	}

	recursiveMenu(mainMenu, menuitems);
	mainMenu.addEventListener("blur", blur);

	document.body.appendChild(mainMenu);
	mainMenu.focus();
}

/**
 * Handles contextmenu event.
 * @param {PointerEvent} evt
 */
function handleContextMenu(evt) {
	if (forceCustomMenu || evt.target.getAttribute("data-context-menu")) {
		evt.preventDefault();
		contextMenu(evt.target, evt.clientX, evt.clientY);
	}
}

document.addEventListener("contextmenu", handleContextMenu);
