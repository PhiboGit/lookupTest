// src/components/ListBoxBody.tsx

import React, { type RefObject } from "react"
import type { Table } from "@tanstack/react-table"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption"

interface ListBoxBodyProps<T extends object> {
  state: ComboBoxState<T>
  table: Table<T>
  listBoxRef: RefObject<HTMLElement | null>
  listBoxProps: React.HTMLAttributes<HTMLElement>
}

export function ListBoxBody<T extends object>({
  state,
  table,
  listBoxRef,
  listBoxProps,
}: ListBoxBodyProps<T>) {
  // Convert the collection to an array to map over it.
  const items = Array.from(state.collection)

  return (
    <tbody
      {...listBoxProps}
      // The cast is fine, as this is only used to scroll
      ref={listBoxRef as RefObject<HTMLTableSectionElement>}
      // The `tbody` is now a standard block element within the grid layout.
      style={{
        display: "block",
        width: "100%",
      }}
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <TableRowOption
            key={item.key}
            item={item}
            // We pass the index to find the corresponding row in the table model.
            index={index}
            state={state}
            table={table}
          />
        ))
      ) : (
        // Render "No results" message directly if there are no items.
        <tr>
          <td
            colSpan={table.getVisibleFlatColumns().length}
            style={{
              padding: "8px 12px",
              color: "#888",
              textAlign: "center",
            }}
          >
            No results found.
          </td>
        </tr>
      )}
    </tbody>
  )
}
