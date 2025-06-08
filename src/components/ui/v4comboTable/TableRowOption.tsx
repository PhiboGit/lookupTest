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

  const ref = useRef<HTMLDivElement>(null)

  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: content!.key }, // Pass key safely
    state,
    ref
  )

  if (!layoutInfo) {
    return null
  }

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

  const row = table.getRowModel().rows[content!.index]

  const style = layoutInfoToStyle(layoutInfo, "ltr")

  return (
    <div
      {...optionProps}
      ref={ref}
      role="row"
      style={{
        ...style,
        display: "flex",
        width: "100%",
        background: backgroundColor,
        color: color,
        cursor: isDisabled ? "not-allowed" : "pointer",
        outline: "none",
        borderBottom: "1px solid #eee",
        boxSizing: "border-box",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <div
          key={cell.id}
          role="gridcell"
          style={{
            display: "flex",
            width: cell.column.getSize(),
            padding: "8px 12px",
            boxSizing: "border-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )
}
