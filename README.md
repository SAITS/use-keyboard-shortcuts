# use-keyboard-shortcuts

> An intuitive React hook to enable keyboard shortcuts.

[![NPM](https://img.shields.io/npm/v/use-keyboard-shortcuts.svg)](https://www.npmjs.com/package/use-keyboard-shortcuts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Quick Example

```jsx
  useKeyboardShortcuts([
    { keys: ["ctrl", "a"], onEvent: event => alert("ctrl + a was pressed") },
    { keys: ["shift", "b"], onEvent: event => alert("shift + b was pressed") },
    { keys: ["Tab"], handleNext },
    { keys: ["Esc"], handleClose },
    { keys: ["Enter"], handleSubmit },
  ])

  useKeyboardShortcuts(
    [{ keys: ["ctrl", "shift"], onEvent: () => alert('ctrl + shift + scroll is active') }],
    true,
    [],
    "mousewheel"
  )
}
```

## Features

- Easy to use
- Typescript support
- Multiple shortcuts registered at the same time
- Support for special keys: Shift, Ctrl (command on Mac), Alt (option on Mac).
- Support for `keydown` and `mousewheel` events
- Prevents mature propagation. This means that if you have a shortcut for `ctrl + a` and `ctrl + shift + a` in the same hook, then the action
  for `ctrl + a` will not trigger when pressing `ctrl + shift + a`.

## Install

```bash
$ npm install --save use-keyboard-shortcuts
$ yarn add use-keyboard-shortcuts
```

## Usage

```jsx
import React from "react"
import useKeyboardShortcuts from "use-keyboard-shortcuts"

const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  useKeyboardShortcuts([
    { keys: ["ctrl", "a"], onEvent: event => alert("ctrl + a was pressed") },
    { keys: ["Esc"], onEvent: () => setIsOpen(false)  },
  ])

  return <div>...</div>
}
```

## Arguments

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| Argument (in order) | Type                       | Default     | Description                                                                                                                  |
| ------------------- | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| shortcuts           | `Shortcut[]`               | `undefined` | Array of `Shortcut`-objects that should listen to the specified `dependencies` and `eventType`. See Shortcut object-section. |
| active              | `boolean`                  | `true`      | Disables or enables all shortcuts.
| dependencies        | `any[]`                    | `[]`        | List dependencies of the shortcuts
| eventType           | `"keydown"`/`"mousewheel"` | `"keydown"` | Wether it should listen for keyboard or mouse scroll events

## Shortcut object

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| Key        | Type              | Description                                                          |
| ---------- | ----------------- | -------------------------------------------------------------------- |
| `keys`     | `string[]`        | Combination of [keys](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) that needs to be pressed to trigger `onEvent()`. |
| `onEvent`  | `function(event)` | Action for when combination in `keys` are pressed.                   |
| `disabled` | `boolean`         | Used to disable a shortcut in particular                             |

## Example

See the example-folder for an extended example of how to use this hook with the `mousewheel` event type.

## License

MIT © [SAITS](https://github.com/SAITS)
