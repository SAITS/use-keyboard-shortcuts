import React, { useState } from "react"

import "@testing-library/jest-dom/extend-expect"

import { render, fireEvent } from "@testing-library/react"
import { useKeyboardShortcuts } from "."

const TestComponent = () => {
  const [key, setKey] = useState<string>("Nothing pressed")

  useKeyboardShortcuts([
    { keys: ["a"], onEvent: () => setKey("Pressed a") },
    { keys: ["a"], onEvent: () => setKey("Pressed a") },
    { keys: ["Shift", "Minus"], onEvent: () => setKey("Pressed ?") },
    { keys: ["9"], onEvent: () => setKey("Pressed 9") },
    { keys: ["ctrl", "a"], onEvent: () => setKey("Pressed ctrl + a") },
    {
      keys: ["ctrl", "shift", "a"],
      onEvent: () => setKey("Pressed ctrl + shift + a"),
    },
    {
      keys: ["ctrl", "shift", "alt", "a"],
      onEvent: () => setKey("Pressed ctrl + shift + alt + a"),
    },
  ])

  useKeyboardShortcuts(
    [
      {
        keys: ["ctrl", "shift"],
        onEvent: () => setKey("Scrolled + ctrl + shift"),
      },
    ],
    true,
    [],
    "wheel"
  )
  return <>{key}</>
}

describe("useKeyboardShortcuts", () => {
  it("handles single characters", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { code: "KeyA" })
    expect(await findByText("Pressed a")).toBeInTheDocument()
  })

  it("handles digit characters", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { code: "Digit9" })
    expect(await findByText("Pressed 9")).toBeInTheDocument()
  })

  it("handles ?", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { shiftKey: true, code: "Minus" })
    expect(await findByText("Pressed ?")).toBeInTheDocument()
  })

  it("handles ctrl + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { ctrlKey: true, code: "KeyA" })
    expect(await findByText("Pressed ctrl + a")).toBeInTheDocument()
  })

  it("handles ctrl + shift + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, { shiftKey: true, ctrlKey: true, code: "KeyA" })
    expect(await findByText("Pressed ctrl + shift + a")).toBeInTheDocument()
  })

  it("handles ctrl + shift + alt + char", async () => {
    const { findByText } = render(<TestComponent />)

    fireEvent.keyDown(document, {
      altKey: true,
      shiftKey: true,
      ctrlKey: true,
      code: "KeyA",
    })
    expect(
      await findByText("Pressed ctrl + shift + alt + a")
    ).toBeInTheDocument()
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
    expect(await findByText("Scrolled + ctrl + shift")).toBeInTheDocument()
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
