import { useRef, type RefObject } from "react"
import { useListBox, useOption, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState, Node } from "react-stately"

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLUListElement | null>
  state: ComboBoxState<T>
}
export function ListBox<T extends object>(props: ListBoxProps<T>) {
  const ref = useRef<HTMLUListElement | null>(null)
  const { listBoxRef = ref, state } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        maxHeight: 150,
        overflow: "auto",
        minWidth: 200,
      }}
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  )
}

interface OptionProps<T extends object> {
  item: Node<T>
  state: ComboBoxState<T>
}
function Option<T extends object>({ item, state }: OptionProps<T>) {
  const ref = useRef(null)
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  )

  let backgroundColor
  let color = "black"

  if (isSelected) {
    backgroundColor = "blueviolet"
    color = "white"
  } else if (isFocused) {
    backgroundColor = "gray"
  } else if (isDisabled) {
    backgroundColor = "transparent"
    color = "gray"
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      style={{
        background: backgroundColor,
        color: color,
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {item.rendered}
    </li>
  )
}
