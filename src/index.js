import { useEffect } from "react"

const ALLOWED_COMBO_KEYS = ["ctrl", "shift", "alt"]
const ALLOWED_EVENTS = ["keydown", "mousewheel"]

const throwError = message =>
  console.error(`Error thrown for useKeyboardShortcuts: ${message}`)

const allComboKeysPressed = (keys, event) => {
  if (keys.includes("ctrl") && (!event.ctrlKey && !event.metaKey)) return false
  if (keys.includes("shift") && !event.shiftKey) return false
  if (keys.includes("alt") && !event.altKey) return false
  return true
}

const validateKeys = keys => {
  let errorMessage = undefined

  if (!keys.length)
    errorMessage = `You need to specify a key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )}.`
  if (keys.length > 1)
    errorMessage = `Only one key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )} can be used.
    Found ${keys.length}: [${keys.map(key => `"${key}"`)}].`

  if (errorMessage) throwError(errorMessage)
  return errorMessage === undefined
}

const withoutComboKeys = key => !ALLOWED_COMBO_KEYS.includes(key)

const generateFunction = (shortcut, event) => {
  const keys = shortcut.keys.filter(withoutComboKeys)

  const valid = validateKeys(keys)
  if (!valid) return

  const key = keys[0]

  const shouldExecAction =
    allComboKeysPressed(shortcut.keys, event) &&
    (key === "scroll" || key === event.key) &&
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
    return throwError("You need to pass at least one shortcut as an argument.")

  if (!ALLOWED_EVENTS.includes(eventType))
    return throwError(
      `Unsupported event. Supported events are: ${JSON.stringify(
        ALLOWED_EVENTS
      )}. Found event: "${eventType}".`
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
