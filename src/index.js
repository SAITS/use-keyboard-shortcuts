import { useEffect } from "react"

const ALLOWED_COMBO_KEYS = JSON.stringify(["ctrl", "shift", "alt"])
const ALLOWED_EVENTS = JSON.stringify(["keydown", "mousewheel"])

const throwError = message =>
  console.error(`Error thrown for useKeyboardShortcuts: ${message}`)

const allComboKeysPressed = (keys, event) => {
  if (keys.includes("ctrl") && (!event.ctrlKey && !event.metaKey)) return false
  if (keys.includes("shift") && !event.shiftKey) return false
  if (keys.includes("alt") && !event.altKey) return false
  return true
}

const validateNonComboKeys = keys => {
  if (!keys.length)
    return `You need to specify a key besides ${ALLOWED_COMBO_KEYS}`
  if (keys.length > 1)
    return `Only one key besides ${ALLOWED_COMBO_KEYS} can be used.
    Found ${keys.length}: [${keys.map(key => `"${key}"`)}]`
}

const withoutComboKeys = key => !JSON.parse(ALLOWED_COMBO_KEYS).includes(key)

const generateFunction = (shortcut, event) => {
  if (!event) return throwError("No event passed to the function")

  const nonComboKeys = shortcut.keys.filter(withoutComboKeys)

  const error = validateNonComboKeys(nonComboKeys)
  if (error) return throwError(error)

  const nonComboKey = nonComboKeys[0]

  const shouldExecAction =
    allComboKeysPressed(shortcut.keys, event) &&
    (nonComboKey === "scroll" || nonComboKey === event.key) &&
    !shortcut.disabled

  if (shouldExecAction) {
    event.preventDefault()
    return shortcut.onEvent(event)
  }
}

const useKeyboardShortcuts = (
  shortcuts,
  active = true,
  dependencies = [],
  eventType = "keydown"
) => {
  if (!shortcuts || !shortcuts.length)
    return throwError("You need to pass at least one shortcut as an argument")

  if (!ALLOWED_EVENTS.includes(eventType))
    return throwError(
      `Unsupported event. Supported events are: ${ALLOWED_EVENTS}. Found event: "${eventType}"`
    )

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
