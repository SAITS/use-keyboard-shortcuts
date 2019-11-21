import React, { useState } from "react"

import "@testing-library/jest-dom/extend-expect"

import { render, fireEvent } from "@testing-library/react"
import { useKeyboardShortcuts } from "."

const TestComponent = () => {
  const [combinations, setCombinations] = useState<string[]>([])

  const appendCombination = (combination: string) =>
    setCombinations([...combinations, combination])

  useKeyboardShortcuts([
    { keys: ["a"], onEvent: () => appendCombination("a") },
    { keys: ["?"], onEvent: () => appendCombination("?") },
    { keys: ["Shift", "Minus"], onEvent: () => appendCombination("shift + ?") },
    { keys: ["9"], onEvent: () => appendCombination("9") },
    {
      keys: ["ctrl", "a"],
      onEvent: () => appendCombination("ctrl + a"),
    },
    {
      keys: ["ctrl", "shift", "a"],
      onEvent: () => appendCombination("ctrl + shift + a"),
    },
    {
      keys: ["ctrl", "shift", "alt", "a"],
      onEvent: () => appendCombination("ctrl + shift + alt + a"),
    },
  ])

  useKeyboardShortcuts(
    [
      {
        keys: ["ctrl", "shift"],
        onEvent: () => appendCombination("ctrl + shift + scroll"),
      },
    ],
    true,
    [],
    "wheel"
  )

  return <>{combinations.join(", ")}</>
}

describe("useKeyboardShortcuts", () => {
  it("handles single characters", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { code: "KeyA" })
    expect(await findByText("a")).toBeInTheDocument()
  })

  it("handles digit characters", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { code: "Digit9" })
    expect(await findByText("9")).toBeInTheDocument()
  })

  it("handles ?", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { key: "?" })
    expect(await findByText("?")).toBeInTheDocument()
  })

  it("handles ? even if shift is pressed (swedish keyboard layout for instance)", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { shiftKey: true, code: "Minus" })
    expect(await findByText("shift + ?")).toBeInTheDocument()
  })

  it("handles ctrl + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { ctrlKey: true, code: "KeyA" })
    expect(await findByText("ctrl + a")).toBeInTheDocument()
  })

  it("handles mature propagation", async () => {
    const comboEvent = jest.fn()

    const MaturePropagation = () => {
      useKeyboardShortcuts([
        { keys: ["ctrl", "shift", "a"], onEvent: comboEvent },
      ])
      return null
    }

    render(<MaturePropagation />)

    fireEvent.keyDown(document, { ctrlKey: true, code: "KeyA" })
    expect(comboEvent).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { ctrlKey: true, shiftKey: true, code: "KeyA" })
    expect(comboEvent).toHaveBeenCalled()
  })

  it("handles ctrl + shift + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { shiftKey: true, ctrlKey: true, code: "KeyA" })
    expect(await findByText("ctrl + shift + a")).toBeInTheDocument()
  })

  it("handles ctrl + shift + alt + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, {
      altKey: true,
      shiftKey: true,
      ctrlKey: true,
      code: "KeyA",
    })
    expect(await findByText("ctrl + shift + alt + a")).toBeInTheDocument()
  })

  it("disables shortcuts", async () => {
    const onEventMock = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts([{ keys: ["a"], onEvent: onEventMock }], false)
      useKeyboardShortcuts([{ keys: ["b"], onEvent: onEventMock }], true)
      return null
    }

    render(<InvalidComp />)

    fireEvent.keyDown(document, { code: "KeyA" })
    fireEvent.keyDown(document, { code: "KeyB" })

    expect(onEventMock).toHaveBeenCalledTimes(1)
  })

  it("handles scroll event with combo keys", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.wheel(document, { shiftKey: true, ctrlKey: true })
    expect(await findByText("ctrl + shift + scroll")).toBeInTheDocument()
  })

  it("throws error when no shortcuts are given", async () => {
    console.error = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts([])
      return null
    }

    render(<InvalidComp />)

    expect(console.error).toHaveBeenCalledWith(
      "Error thrown for useKeyboardShortcuts: You need to pass at least one shortcut as an argument."
    )
  })

  it("throws error when invalid event is given", async () => {
    console.error = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts(
        [{ keys: ["a"], onEvent: console.log }],
        true,
        [],
        // @ts-ignore
        "invalidevent"
      )
      return null
    }

    render(<InvalidComp />)

    expect(console.error).toHaveBeenCalledWith(
      'Error thrown for useKeyboardShortcuts: Unsupported event. Supported events are: ["keydown","wheel"]. Found event: "invalidevent".'
    )
  })

  it("throws error when no key except combo is present", async () => {
    console.error = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts([{ keys: ["ctrl"], onEvent: jest.fn() }])
      return null
    }

    render(<InvalidComp />)

    fireEvent.keyDown(document, { ctrlKey: true })

    expect(console.error).toHaveBeenCalledWith(
      'Error thrown for useKeyboardShortcuts: You need to specify a key besides ["ctrl","shift","alt"] for keydown events.'
    )
  })

  it("throws error when no keys are given", async () => {
    console.error = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts([{ keys: [], onEvent: jest.fn() }])
      return null
    }

    render(<InvalidComp />)

    fireEvent.keyDown(document, { ctrlKey: true })

    expect(console.error).toHaveBeenCalledWith(
      'Error thrown for useKeyboardShortcuts: You need to specify a key besides ["ctrl","shift","alt"] for keydown events.'
    )
  })

  it("throws error when invalid multiple non-combo keys are present", async () => {
    console.error = jest.fn()

    const InvalidComp = () => {
      useKeyboardShortcuts([{ keys: ["a", "b"], onEvent: jest.fn() }])
      return null
    }

    render(<InvalidComp />)

    fireEvent.keyDown(document, { ctrlKey: true })

    expect(console.error).toHaveBeenCalledWith(
      'Error thrown for useKeyboardShortcuts: Only one key besides ["ctrl","shift","alt"] can be used. Found 2: ["a","b"].'
    )
  })
})
