import { flexRender, type Table } from "@tanstack/react-table"
import { useRef } from "react"
import { useOption } from "react-aria"
import type { ComboBoxState, Node } from "react-stately"

interface OptionProps<T extends object> {
  item: Node<T>
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableRowOption<T extends object>({
  item,
  state,
  table,
}: OptionProps<T>) {
  const ref = useRef<HTMLTableRowElement>(null) // Use HTMLTableRowElement for <tr>
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  )

  let backgroundColor
  let color = "black"

  if (isDisabled) {
    backgroundColor = "transparent"
    color = "gray"
  } else if (isSelected) {
    backgroundColor = "blueviolet"
    color = "white"
  } else if (isFocused) {
    backgroundColor = "rgba(0, 0, 0, 0.1)"
  }

  // Get the TanStack Table row using the item's index from React Stately's collection
  const row = table.getRowModel().rows[item.index]

  // Handle case where row might not be found (e.g., during quick filtering/updates)
  if (!row) {
    return null // Or some fallback UI
  }

  return (
    // This `tr` has role="option" and all the accessibility props.
    // We style it to act as a flex container to align cells.
    <tr
      {...optionProps}
      ref={ref}
      style={{
        display: "flex", // IMPORTANT: Make the row a flex container
        width: "100%", // Ensure it takes full width of the block tbody
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        borderBottom: "1px solid #eee", // Optional: visual row separation
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
            width: cell.column.getSize(), // SET EXPLICIT WIDTH
            padding: "8px 12px", // Optional: for spacing
            boxSizing: "border-box", // Important if you have padding/borders on cells
            overflow: "hidden", // Optional: prevent content from breaking layout
            textOverflow: "ellipsis", // Optional: show ellipsis for overflow
            whiteSpace: "nowrap", // Optional: prevent wrapping that might break layout
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
