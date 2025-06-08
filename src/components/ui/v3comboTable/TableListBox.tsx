import { useRef, type RefObject } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption"
import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table" // Import flexRender here

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef?: RefObject<HTMLUListElement | null> // Make optional if default is used
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  const defaultRef = useRef<HTMLUListElement | null>(null)
  const { listBoxRef = defaultRef, state, table } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <table
      style={{
        display: "grid",
        minWidth: 400, // Keep your minWidth or make it configurable
      }}
    >
      <thead
        onMouseDown={(e) => e.preventDefault()}
        style={{ display: "flex" }}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} style={{ display: "table-row" }}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan} // Important for TanStack Table
                style={{
                  width: header.getSize(), // SET EXPLICIT WIDTH
                  textAlign: "left", // Optional: better default
                  padding: "8px 12px", // Optional: for spacing
                  borderBottom: "1px solid #ccc", // Optional: visual separation
                  cursor: header.column.getCanSort() ? "pointer" : "default",
                  userSelect: "none",
                }}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      // Use flexRender for header content too
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                {/* Add sorting indicators */}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody
        {...listBoxProps}
        ref={listBoxRef}
        style={{
          display: "block", // ADD THIS: Makes tbody scroll independently
          maxHeight: 250, // Your desired scrollable height
          overflow: "auto",
        }}
      >
        {[...state.collection].map((item) => (
          <TableRowOption
            key={item.key}
            item={item}
            state={state}
            table={table}
          />
        ))}
        {state.collection.size === 0 && (
          <tr style={{ display: "flex" }}>
            <td
              colSpan={table.getAllColumns().length} // Span across all columns
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
    </table>
  )
}
