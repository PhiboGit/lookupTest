// src/components/TableRowOption.tsx

import { flexRender, type Table } from "@tanstack/react-table"
import React, { useRef } from "react"
import { useOption } from "react-aria"
import { layoutInfoToStyle } from "@react-aria/virtualizer"
import { type ReusableView } from "@react-stately/virtualizer"
import type { ComboBoxState, Node } from "react-stately"

interface OptionProps<T extends object> {
  view: ReusableView<Node<T>, React.ReactNode>
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableRowOption<T extends object>({
  view,
  state,
  table,
}: OptionProps<T>) {
  const { content, layoutInfo } = view

  // The ref is now on a <tr> element
  const ref = useRef<HTMLTableRowElement>(null)

  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: content!.key },
    state,
    ref
  )

  if (!layoutInfo) {
    return null
  }

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

  const row = table.getRowModel().rows[content!.index]
  const style = layoutInfoToStyle(layoutInfo, "ltr")

  return (
    // SEMANTIC CHANGE: The root is now a <tr>.
    // It gets the `optionProps` for accessibility and interaction.
    // The `role="row"` is removed as it's redundant.
    <tr
      {...optionProps}
      ref={ref}
      style={{
        ...style,
        // Using `display: flex` on a <tr> is a layout hack to ensure
        // child <td> elements respect the widths set by the columns.
        display: "flex",
        width: "100%",
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        // SEMANTIC CHANGE: Each cell is now a <td>.
        // The `role="gridcell"` is removed.
        <td
          key={cell.id}
          style={{
            display: "flex",
            alignItems: "center", // Vertically center content
            width: cell.column.getSize(),
            padding: "8px 12px",
            boxSizing: "border-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            // Remove the per-row border, it's handled in the <thead> now.
            border: "none",
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
