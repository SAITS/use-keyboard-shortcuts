import React, { useState } from "react"
import useKeyboardShortcuts from "use-keyboard-shortcuts"

const handlePressCtrlA = event => alert("ctrl + a was pressed")

const handlePressA = event => alert("a was pressed")

const handlePressCtrlShiftA = event => alert("ctrl + shift + a was pressed")

const handlePressCtrlShiftAltA = event =>
  alert("ctrl + shift + alt + a was pressed")

const App = () => {
  const [scrollIsActive, setCtrlScrollIsActive] = useState(false)
  const [rangeValue, setRangeValue] = useState(10)

  const handleScroll = ({ movementX }) => {
    if (movementX > 0 && rangeValue < 20) return setRangeValue(rangeValue + 1)
    if (movementX < 0 && rangeValue > 1) return setRangeValue(rangeValue - 1)
  }

  useKeyboardShortcuts([
    { keys: ["KeyA"], onEvent: handlePressA },
    { keys: ["Ctrl", "KeyA"], onEvent: handlePressCtrlA },
    { keys: ["ctrl", "shift", "KeyA"], onEvent: handlePressCtrlShiftA },
    {
      keys: ["ctrl", "shift", "alt", "KeyA"],
      onEvent: handlePressCtrlShiftAltA,
    },
  ])
  useKeyboardShortcuts(
    [{ keys: ["ctrl", "shift"], onEvent: handleScroll }],
    scrollIsActive,
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
            Press <code>a</code> to trigger an alert
          </span>
        </div>
        <div className="example-container">
          <span>
            Press <code>ctrl/cmd + a</code> to trigger another alert
          </span>
        </div>
        <div className="example-container">
          <span>
            Press <code>ctrl/cmd + shift + a</code> to trigger another alert
          </span>
        </div>
        <div className="example-container">
          <span>
            Press <code>ctrl/cmd + shift + alt/opt + a</code> to trigger another
            alert
          </span>
        </div>
        <div />
        <div className="example-container">
          <label htmlFor="ctrlShiftScroll">
            <span>
              Check this box to enable <code>ctrl/cmd + shift + scroll</code>
            </span>
            <input
              type="checkbox"
              className="checkbox"
              name="ctrlShiftScroll"
              checked={scrollIsActive}
              onChange={() => setCtrlScrollIsActive(!scrollIsActive)}
            />
          </label>
          <span>
            Try holding down <code>ctrl/cmd + shift</code> and move the mouse
            wheel
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
