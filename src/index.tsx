import { useEffect } from "react"

export type Shortcut = {
  keys: string[]
  onEvent: (event: ShortcutEvent) => void
  test?: string
  disabled?: boolean
}

export type ShortcutEvent = KeyboardEvent | WheelEvent

const ALLOWED_COMBO_KEYS = ["ctrl", "shift", "alt"]
const ALLOWED_EVENTS = ["keydown", "wheel"]

const throwError = (message: string): void =>
  console.error(`Error thrown for useKeyboardShortcuts: ${message}`)

const allComboKeysPressed = (keys: string[], event: ShortcutEvent) => {
  keys = keys.map(key => key.toLowerCase())
  if (keys.includes("ctrl") && (!event.ctrlKey && !event.metaKey)) return false
  if (keys.includes("shift") && !event.shiftKey) return false
  if (keys.includes("alt") && !event.altKey) return false
  return true
}

const validateKeys = (keys: string[]) => {
  let errorMessage: string | null = null

  if (!keys.length)
    errorMessage = `You need to specify a key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )} for keydown events.`
  if (keys.length > 1)
    errorMessage = `Only one key besides ${JSON.stringify(
      ALLOWED_COMBO_KEYS
    )} can be used. Found ${keys.length}: [${keys.map(key => `"${key}"`)}].`

  return errorMessage ? throwError(errorMessage) : true
}

const withoutComboKeys = (key: string) =>
  !ALLOWED_COMBO_KEYS.includes(key.toLowerCase())

const comboKeys = (key: string) =>
  ALLOWED_COMBO_KEYS.includes(key.toLowerCase())

const isSingleKeyEvent = (e: ShortcutEvent) =>
  !e.shiftKey && !e.metaKey && !e.altKey && !e.ctrlKey

const isSingleKeyShortcut = (shortcut: Shortcut) =>
  !shortcut.keys.filter(comboKeys).length

const getKeyCode = (key: string) => {
  if (key.length === 1 && key.search(/[^a-zA-Z]+/) === -1)
    return `Key${key.toUpperCase()}`

  if (key.length === 1 && typeof Number(key) === "number") return `Digit${key}`

  return key
}

export const useKeyboardShortcuts = (
  shortcuts: Shortcut[],
  active = true,
  dependencies: unknown[] = [],
  eventType: "keydown" | "wheel" = "keydown"
): void => {
  if (!shortcuts || !shortcuts.length)
    return throwError("You need to pass at least one shortcut as an argument.")

  if (!ALLOWED_EVENTS.includes(eventType))
    return throwError(
      `Unsupported event. Supported events are: ${JSON.stringify(
        ALLOWED_EVENTS
      )}. Found event: "${eventType}".`
    )

  const shortcutHasPrioroty = (
    inputShortcut: Shortcut,
    event: ShortcutEvent
  ) => {
    if (shortcuts.length === 1) return true
    if (isSingleKeyShortcut(inputShortcut) && isSingleKeyEvent(event))
      return true

    return !shortcuts.find(
      shortcut =>
        allComboKeysPressed(shortcut.keys, event) &&
        shortcut.keys.length > inputShortcut.keys.length
    )
  }

  const callCallback = (shortcut: Shortcut, event: ShortcutEvent) => {
    if (event instanceof KeyboardEvent) {
      const keys = shortcut.keys.filter(withoutComboKeys)
      const valid = validateKeys(keys)

      if (!valid || getKeyCode(keys[0]) !== event.code) return
    }

    const shouldExecAction =
      !shortcut.disabled &&
      allComboKeysPressed(shortcut.keys, event) &&
      shortcutHasPrioroty(shortcut, event)

    if (shouldExecAction) {
      event.preventDefault()
      shortcut.onEvent(event)
    }
  }

  const handleKeyboardShortcuts = (e: ShortcutEvent) =>
    shortcuts.forEach(shortcut => callCallback(shortcut, e))

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
