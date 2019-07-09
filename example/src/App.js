import React, { useState } from "react"

import useKeyboardShortcuts from "use-keyboard-shortcuts"

const handleAlert = event => alert("ctrl + a was clicked")

const App = () => {
  const [ctrlScrollIsActive, setCtrlScrollIsActive] = useState(false)
  const [rangeValue, setRangeValue] = useState(10)

  const handleCtrlScroll = event => {
    const movementX = event.movementX
    if (movementX > 0 && rangeValue < 20) return setRangeValue(rangeValue + 1)
    if (movementX < 0 && rangeValue > 1) return setRangeValue(rangeValue - 1)
  }

  useKeyboardShortcuts([{ keys: ["ctrl", "a"], onEvent: handleAlert }])
  useKeyboardShortcuts(
    [{ keys: ["ctrl", "shift", "scroll"], onEvent: handleCtrlScroll }],
    ctrlScrollIsActive,
    [rangeValue],
    "mousewheel"
  )

  return (
    <main>
      <header>
        <h1>Examples for useKeyboardShortcuts</h1>
      </header>
      <section className="content">
        <div className="example-container">
          <span>
            Press <code>ctrl/cmd + a</code> to trigger an alert
          </span>
        </div>
        <div />
        <div className="example-container">
          <label htmlFor="ctrlScroll">
            <span>
              Check this box to enable <code>ctrl + shift + scroll</code>
            </span>
            <input
              type="checkbox"
              className="checkbox"
              name="ctrlScroll"
              checked={ctrlScrollIsActive}
              onChange={() => setCtrlScrollIsActive(!ctrlScrollIsActive)}
            />
          </label>
          <span>
            Try holding down <code>ctrl + shift</code> and move the mouse wheel
          </span>
          <input
            type="range"
            max={20}
            min={1}
            value={rangeValue}
            className="range-slider"
            onChange={e => setRangeValue(Number(e.target.value))}
          />
        </div>
      </section>
    </main>
  )
}

export default App
