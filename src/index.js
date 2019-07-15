import { useEffect } from "react"

const ALLOWED_COMBO_KEYS = ["ctrl", "shift", "alt"]
const ALLOWED_EVENTS = ["keydown", "mousewheel"]

const throwError = message =>
  console.error(`Error thrown for useKeyboardShortcuts: ${message}`)

const allComboKeysPressed = (keys, event) => {
  keys = keys.map(key => key.toLowerCase())
  if (keys.includes("ctrl") && (!event.ctrlKey && !event.metaKey)) return false
  if (keys.includes("shift") && !event.shiftKey) return false
  if (keys.includes("alt") && !event.altKey) return false
  return true
}

const validateKeys = (keys, eventType) => {
  let errorMessage = undefined

  if (eventType !== "mousewheel" && !keys.length)
    errorMessage = `You need to specify a key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )} for keydown events.`
  if (keys.length > 1)
    errorMessage = `Only one key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )} can be used.
    Found ${keys.length}: [${keys.map(key => `"${key}"`)}].`

  if (errorMessage) throwError(errorMessage)
  return errorMessage === undefined
}

const withoutComboKeys = key => !ALLOWED_COMBO_KEYS.includes(key.toLowerCase())

const comboKeys = key => ALLOWED_COMBO_KEYS.includes(key.toLowerCase())

const isSingleKeyEvent = event =>
  !event.shiftKey && !event.metaKey && !event.altKey && !event.ctrlKey

const isSingleKeyShortcut = shortcut => !shortcut.keys.filter(comboKeys).length

const useKeyboardShortcuts = (
  shortcuts,
  active = true,
  dependencies = [],
  eventType = "keydown"
) => {
  if (!shortcuts || !shortcuts.length)
    return throwError("You need to pass at least one shortcut as an argument.")

  if (!ALLOWED_EVENTS.includes(eventType))
    return throwError(
      `Unsupported event. Supported events are: ${JSON.stringify(
        ALLOWED_EVENTS
      )}. Found event: "${eventType}".`
    )

  const shortcutHasPrioroty = (inputShortcut, key, event) => {
    if (shortcuts.length === 1) return true
    if (isSingleKeyShortcut(inputShortcut) && isSingleKeyEvent(event))
      return true

    const hasSameKey = shortcut =>
      shortcut.keys.includes(key) && shortcut !== inputShortcut

    const shortcutsWithSameKey = shortcuts.filter(hasSameKey)
    if (!shortcutsWithSameKey.length) return true

    return (
      allComboKeysPressed(inputShortcut.keys, event) &&
      !shortcutsWithSameKey.find(
        shortcut =>
          allComboKeysPressed(shortcut.keys, event) &&
          shortcut.keys.length > inputShortcut.keys.length
      )
    )
  }

  const generateFunction = (shortcut, event) => {
    const keys = shortcut.keys.filter(withoutComboKeys)

    const valid = validateKeys(keys, event.type)
    if (!valid) return

    const key = keys[0]
    const keyCode = `Key${key.toUpperCase()}`

    const shouldExecAction =
      !shortcut.disabled &&
      allComboKeysPressed(shortcut.keys, event) &&
      (event.type === "mousewheel" || keyCode === event.code) &&
      shortcutHasPrioroty(shortcut, key, event)

    if (shouldExecAction) {
      event.preventDefault()
      shortcut.onEvent(event)
    }
  }

  const handleKeyboardShortcuts = e =>
    shortcuts.forEach(shortcut => generateFunction(shortcut, e))

  const addEventListener = () =>
    document.addEventListener(eventType, handleKeyboardShortcuts, {
      passive: false,
    })

  const removeEventListener = () =>
    document.removeEventListener(eventType, handleKeyboardShortcuts)

  useEffect(() => {
    active ? addEventListener() : removeEventListener()
    return removeEventListener
  }, [active, ...dependencies])
}

export default useKeyboardShortcuts
