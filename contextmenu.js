/** 
 * If false, Show browser's native menu when no custom menu is specified.
 */
let forceCustomMenu = true;

/**
 * The default menu to display when no menu is specified.
 */
let defaultMenu = [
	/* Default menu items here */
];

/**
 * List of menus to refrence.
 */
let menus = {
	/* List of menus here */
};

/**
 * Adds a new context menu
 * 
 * @param {Element} target The target element, required
 * @param {Number} x X position of the menu
 * @param {Number} y Y position of the menu
 * @param {Array} customMenu The menu to force-use
 * 
 * @returns {Element} The menu that was just added
 */
function contextMenu(target, x, y, customMenu) {
	document.getElementsByClassName("context-menu")[0]?.remove();

	const mainMenu = document.createElement("ul");
	mainMenu.tabIndex = 0;
	mainMenu.classList.add("menu");
	mainMenu.classList.add("context-menu");
	const targetRect = target.getBoundingClientRect();
	mainMenu.style.left = (x ?? targetRect.x) + "px";
	mainMenu.style.top = (y ?? targetRect.y) + "px";
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

	const rect = mainMenu.getBoundingClientRect();

	if (rect.right > window.innerWidth) {
		mainMenu.style.left = window.innerWidth - rect.width + "px";
	}
	if (rect.bottom > window.innerHeight) {
		mainMenu.style.top = window.innerHeight - rect.height + "px";
	}

	mainMenu.focus();

	return mainMenu;
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
