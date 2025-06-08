import { useComboBox, useFilter } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import { ListBox } from "./ListBox"
import { useRef } from "react"
import { Popover } from "./Popover"
import { ComboButton } from "./ComboButton"
import { Input } from "../input"

export function ComboBoxListBox<T extends object>(
  props: ComboBoxStateOptions<T>
) {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: "base" })
  const state = useComboBoxState({
    ...props,
    defaultFilter: contains,
  })

  // Setup refs and get props for child elements.
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
      <div className="flex">
        <Input
          {...inputProps}
          ref={inputRef}
          style={{
            height: 24,
            boxSizing: "border-box",
            marginRight: 0,
            fontSize: 16,
          }}
        />
        <ComboButton
          {...buttonProps}
          buttonRef={buttonRef}
          style={{
            height: 24,
            marginLeft: 0,
          }}
        >
          <span aria-hidden="true" style={{ padding: "0 2px" }}>
            ▼
          </span>
        </ComboButton>
        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
          >
            <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
          </Popover>
        )}
      </div>
    </div>
  )
}
