import { useRef } from "react"
import { useOption } from "react-aria"
import type { ComboBoxState, Node } from "react-stately"

interface OptionProps<T extends object> {
  item: Node<T>
  state: ComboBoxState<T>
}

export function TableRowOption<T extends object>({
  item,
  state,
}: OptionProps<T>) {
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
    backgroundColor = "rgba(0, 0, 0, 0.1)"
  } else if (isDisabled) {
    backgroundColor = "transparent"
    color = "gray"
  }

  return (
    // This `li` has role="option" and all the accessibility props.
    // We style it to act as a flex container (a table row).
    <tr
      {...optionProps}
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        background: backgroundColor,
        color: color,
        cursor: "pointer",
        outline: "none",
      }}
    >
      {item.rendered}
    </tr>
  )
}
