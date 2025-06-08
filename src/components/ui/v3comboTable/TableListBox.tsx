import { useRef, type RefObject } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption"
import type { Table } from "@tanstack/react-table" // ✨ NEW

interface Animal {
  id: number
  name: string
  class: string
  diet: string
}

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLUListElement | null>
  state: ComboBoxState<T>
  table: Table<Animal> // ✨ NEW: Receive the table instance
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  const ref = useRef<HTMLUListElement | null>(null)
  const { listBoxRef = ref, state, table } = props // Destructure table
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <div
      style={{
        overflow: "auto", //our scrollable table container
        position: "relative", //needed for sticky header
      }}
    >
      <table
        style={{ display: "grid", minWidth: 400, border: "1px solid #ccc" }}
      >
        {/* ✨ NEW: Render a dynamic, interactive header from TanStack Table */}
        <thead
          onMouseDown={(e) => e.preventDefault()}
          style={{
            display: "grid",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{ display: "flex", width: "100%", fontWeight: "bold" }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    flex: `${header.getSize()} 0 auto`,
                    padding: "8px 12px",
                    background: "#f0f0f0",
                    borderBottom: "1px solid #ccc",
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : (header.column.columnDef.header as string)}
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
            margin: 0,
            padding: 0,
            listStyle: "none",
            maxHeight: 250,
            overflow: "auto",
          }}
        >
          {/* This part remains the same! It renders the options managed by React Aria */}
          {[...state.collection].map((item) => (
            <TableRowOption key={item.key} item={item} state={state} />
          ))}
          {state.collection.size === 0 && (
            <tr style={{ padding: "8px 12px", color: "#888" }}>
              No results found.
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
