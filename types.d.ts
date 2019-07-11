import * as React from "react"

export interface Shortcut {
  keys: string[]
  onEvent: (event: KeyboardEvent | WheelEvent) => void
  disabled?: boolean
}
export type EventTypes = "keydown" | "mousewheel"
export enum EventType {
  KeyDown = "keydown",
  MouseWheel = "mousewheel",
}
declare function useKeyboardShortcuts(
  shortcut: Shortcut[],
  active?: boolean,
  dependencies?: any[],
  eventType?: EventTypes
): void
export default useKeyboardShortcuts
