// src/components/ListBoxBody.tsx

import { useEffect, useMemo, type RefObject } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Table } from "@tanstack/react-table"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption"

interface ListBoxBodyProps<T extends object> {
  state: ComboBoxState<T>
  table: Table<T>
  listBoxRef: RefObject<HTMLDivElement | null>
}

export function ListBoxBody<T extends object>({
  state,
  table,
  listBoxRef,
}: ListBoxBodyProps<T>) {
  const items = useMemo(() => Array.from(state.collection), [state.collection])
  // The virtualizer hook manages the virtual items.
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => listBoxRef.current,

    // A fixed row height is used here, matching the original implementation.
    estimateSize: () => 35,
    // Add overscan for a smoother scrolling experience.
    // Has the at least the number of a page to navigate with page up/down.
    overscan: 20,
  })

  useEffect(() => {
    if (state.isOpen) {
      const selectedIndex = state.selectedItem?.index
      if (selectedIndex && typeof selectedIndex === "number") {
        // only nessary for virtualization
        setTimeout(() => {
          rowVirtualizer.scrollToIndex(selectedIndex, { align: "start" })
        }, 0)
      }
    }
  }, [state.isOpen, state.selectedItem, rowVirtualizer, state.inputValue])

  return (
    <>
      <tbody
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
    </>
  )
}
