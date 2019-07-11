declare module "use-keyboard-shortcuts" {
  declare function useKeyboardShortcuts(
    shortcut: Shortcut[],
    active?: boolean,
    dependencies?: any[],
    eventType?: EventTypes
  ): void
  export default useKeyboardShortcuts

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
}
