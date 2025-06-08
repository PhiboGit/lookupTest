import { useComboBox, useFilter } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import { useRef } from "react"
import { Popover } from "./Popover"
import { ComboButton } from "./ComboButton"
import { TableListBox } from "./TableListBox" // We will create this
import { Input } from "../input"

export function ComboBoxTable<T extends object>(
  props: ComboBoxStateOptions<T>
) {
  const { contains } = useFilter({ sensitivity: "base" })
  const state = useComboBoxState({ ...props, defaultFilter: contains })

  const buttonRef = useRef(null)
  const inputRef = useRef(null)
  const listBoxRef = useRef(null)
  const popoverRef = useRef(null)

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  )

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <label {...labelProps}>{props.label}</label>
      <div style={{ display: "flex" }}>
        <Input
          {...inputProps}
          ref={inputRef}
          style={{
            height: 24,
            boxSizing: "border-box",
            fontSize: 16,
            flex: 1, // Allow input to grow
          }}
        />
        <ComboButton
          {...buttonProps}
          buttonRef={buttonRef}
          style={{
            height: 24,
          }}
        >
          <span aria-hidden="true" style={{ padding: "0 2px" }}>
            ▼
          </span>
        </ComboButton>
      </div>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={inputRef}
          popoverRef={popoverRef}
          isNonModal
          placement="bottom start"
        >
          {/* Here we render our new TableListBox instead of ListBox */}
          <TableListBox
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
          />
        </Popover>
      )}
    </div>
  )
}
