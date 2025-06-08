// src/components/TableRowOption.tsx

import { flexRender, type Table } from "@tanstack/react-table"
import { useRef } from "react"
import { useOption } from "react-aria"
import type { ComboBoxState, Node } from "react-stately"

interface OptionProps<T extends object> {
  item: Node<T>
  index: number // The index of the row in the collection.
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableRowOption<T extends object>({
  item,
  index,
  state,
  table,
}: OptionProps<T>) {
  const ref = useRef<HTMLTableRowElement>(null)

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

  // Find the row from the table model using the index.
  const row = table.getRowModel().rows[index]
  if (!row) return null // Safety check

  return (
    // This `<tr>` is now a standard table row.
    <tr
      {...optionProps}
      ref={ref}
      style={{
        display: "flex", // Layout hack for `<tr>` to respect child `<td>` widths.
        width: "100%",
        minHeight: "35px", // Ensure a minimum row height.
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        boxSizing: "border-box",
        borderTop: "1px solid #eee", // Optional: adds separation between rows.
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
