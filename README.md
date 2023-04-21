# Context Menus

A custom context menu library for the web!
Waiting for the day where they add an offical context menu API...

Example showcase: <https://tech-tac.github.io/context-menu/>

## Features

- Extendability
- Customizability
- Ease of use
- Sub-menus
- Icons
- Headers
- Separators
- Disabled items
- Click actions
- Keyboard accessable
- Touch screen support
- And more to come!

## Documentation

A menu should be defined as an array of menu items.
Menu items are objects that can have a list of properties, which are:

- `text`: The text to display on the item.
- `icon`: The URL of the icon to display beside the item.
- `disabled`: Whether or not the item should be disabled, being disabled prevents it from getting selected or triggrered.
- `shortcut`: Secondary text to display on the item, often used as to identify the keyboard shortcut used to trigger this command.
- `submenu`: An array of other menu items, defining a menu.
- `close`: Whether trigerring the item should close the menu or not, defaults to true unless the item is a sub-menu.
- `action(target)`: The function to execute when the item is triggered, `target` is the target element of the context menu.
- `load(menuItem, target)`:The function to execute when the item loads, `menuItem` is the item element, `target` is the target element of the context menu.
- `header`: If true, the item acts as a header
- `separator`: If true, the item acts as a separator and ignores all other properties.

This project is still in it's beginnings, And so am I! So help me learn by contributing in this project!
