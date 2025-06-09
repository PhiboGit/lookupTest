// src/components/TableRowOption.tsx

import { flexRender, type Row } from "@tanstack/react-table"
import { useRef } from "react"
import { useOption } from "react-aria"
import type { ComboBoxState } from "react-stately"

interface OptionProps<T extends object> {
  row: Row<T>
  state: ComboBoxState<T>
}

export function TableRowOption<T extends object>({
  row,
  state,
}: OptionProps<T>) {
  const ref = useRef<HTMLTableRowElement>(null)

  // Get the item from React Stately's collection
  // These should be linked with TanStack Table
  const item = state.collection.getItem(row.id)!

  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  )

  let backgroundColor
  let color = "black"

  if (isDisabled) {
    color = "gray"
  } else if (isSelected) {
    backgroundColor = "blueviolet"
    color = "white"
  } else if (isFocused) {
    backgroundColor = "rgba(0, 0, 0, 0.1)"
  }

  return (
    <tr
      {...optionProps}
      ref={ref}
      style={{
        display: "flex",
        width: "100%",
        minHeight: "35px",
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        boxSizing: "border-box",
        borderTop: "1px solid #eee",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
            display: "flex",
            alignItems: "center",
            width: cell.column.getSize(),
            padding: "8px 12px",
            boxSizing: "border-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
