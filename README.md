# use-keyboard-shortcuts

> React hook to attach keyboard shortcuts to the document.

[![NPM](https://img.shields.io/npm/v/react-drawable-overlay.svg)](https://www.npmjs.com/package/use-keyboard-shortcuts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
    { keys: ["ctrl", "a"], onEvent: event => alert("ctrl + a was clicked") },
  ])

  return <div>...</div>
}
```

## Arguments

- `First argument` - Array of shortcut objects (See Shortcut object-section below).
- `Second argument` - Boolean. Whether or not the listener should be active. Defaults to true.
- `Third argument` - Array of dependencies for when the listener should be updated. Defaults to [].
- `Fourth argument` - String. Event type to decide which event the shortcut functions should trigger on. Can be "keydown" or "mousewheel". Defaults to "keydown".

## Shortcut object

- `keys` - Array of keys needed to be pressd to trigger the function specified in onEvent.
- `onEvent` - Function to be triggered when the key combination in `keys` are pressed.
- `disabled` - Boolean (Optional). Used if you need to disable the function from being triggered.

## Example

See the example-folder for an extended example of how to use this with the "mousewheel" event type.

## License

MIT © [SAITS](https://github.com/SAITS)
