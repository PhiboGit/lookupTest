// src/components/TableRowOption.tsx

import { flexRender, type Table } from "@tanstack/react-table"
import { useRef } from "react"
import { useOption } from "react-aria"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { ComboBoxState, Node } from "react-stately"

interface OptionProps<T extends object> {
  item: Node<T>
  virtualRow: VirtualItem
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableRowOption<T extends object>({
  item,
  virtualRow,
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

  const row = table.getRowModel().rows[virtualRow.index]

  return (
    // This `<tr>` is absolutely positioned within the `<tbody>`.
    <tr
      {...optionProps}
      ref={ref}
      data-index={virtualRow.index}
      style={{
        position: "absolute",
        width: "100%",
        // `transform` is used for efficient repositioning on scroll.
        transform: `translateY(${virtualRow.start}px)`,
        display: "flex", // Layout hack for `<tr>` to respect child `<td>` widths.
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
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
