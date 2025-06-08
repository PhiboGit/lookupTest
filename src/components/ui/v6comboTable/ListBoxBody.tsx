// src/components/ListBoxBody.tsx

import React, { type RefObject } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Table } from "@tanstack/react-table"
import type { ComboBoxState, Node } from "react-stately"
import { TableRowOption } from "./TableRowOption"

interface ListBoxBodyProps<T extends object> {
  state: ComboBoxState<T>
  table: Table<T>
  items: Node<T>[]
  scrollRef: RefObject<HTMLDivElement | null>
  listBoxRef: RefObject<HTMLTableSectionElement | null>
  listBoxProps: React.HTMLAttributes<HTMLElement>
}

export function ListBoxBody<T extends object>({
  state,
  table,
  items,
  scrollRef,
  listBoxRef,
  listBoxProps,
}: ListBoxBodyProps<T>) {
  // The virtualizer hook manages the virtual items.
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,

    // A fixed row height is used here, matching the original implementation.
    estimateSize: () => 35,
    // Add overscan for a smoother scrolling experience.
    overscan: 5,
  })

  return (
    <tbody
      {...listBoxProps}
      ref={listBoxRef}
      style={{
        display: "grid",
        // The total height of all items, for a correct scrollbar.
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative", // Necessary for absolute positioning of child rows.
        width: "100%",
      }}
    >
      {items.length > 0 ? (
        rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index]
          return (
            <TableRowOption
              key={item.key}
              item={item}
              virtualRow={virtualRow}
              state={state}
              table={table}
            />
          )
        })
      ) : (
        // Render "No results" message directly if there are no items.
        // It does not need to be virtualized.
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
