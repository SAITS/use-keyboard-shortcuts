# use-keyboard-shortcuts

> React hook to attach keyboard shortcuts to the document.

[![NPM](https://img.shields.io/npm/v/use-keyboard-shortcuts.svg)](https://www.npmjs.com/package/use-keyboard-shortcuts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- Support for `keydown` and `mousewheel` events
- Attaches listeners to the document
- Prevents propagation. This means that if you have a shortcut for `ctrl + a` and `ctrl + shift + a` in the same hook, then the action
  for `ctrl + a` will not trigger when pressing `ctrl + shift + a`. (Not supported for `mousewheel` event type yet.)
- Support for special keys: Shift, Ctrl (command on Mac), Alt (option on Mac).

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
  useKeyboardShortcuts([
    { keys: ["ctrl", "KeyA"], onEvent: event => alert("ctrl + a was pressed") },
  ])

  return <div>...</div>
}
```

## Arguments

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| Argument (in order) | Type                       | Default     | Description                                                                                                                  |
| ------------------- | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| shortcuts           | `Shortcut[]`               | `undefined` | Array of `Shortcut`-objects that should listen to the specified `dependencies` and `eventType`. See Shortcut object-section. |
| active              | `boolean`                  | `true`      | Whether or not the listener should be active.                                                                                |
| dependencies        | `any[]`                    | `[]`        | If the `onEvent`-callback receives a new value, that value needs to be specified here.                                       |
| eventType           | `"keydown"`/`"mousewheel"` | `"keydown"` | The type of event the listener should listen to.                                                                             |

## Shortcut object

<!-- This table was generated via http://www.tablesgenerator.com/markdown_tables -->

| Key        | Type              | Description                                                          |
| ---------- | ----------------- | -------------------------------------------------------------------- |
| `keys`     | `string[]`        | Combination of keys that needs to be pressed to trigger `onEvent()`. |
| `onEvent`  | `function(event)` | Action for when combination in `keys` are pressed.                   |
| `disabled` | `boolean`         | Used if you need to disable `onEvent()`.                             |

## Example

See the example-folder for an extended example of how to use this hook with the `mousewheel` event type.

## License

MIT © [SAITS](https://github.com/SAITS)
