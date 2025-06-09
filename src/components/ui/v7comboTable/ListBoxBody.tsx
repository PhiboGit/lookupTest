// src/components/ListBoxBody.tsx

import type { Table } from "@tanstack/react-table"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption"
import { type Row } from "@tanstack/react-table"

interface ListBoxBodyProps<T extends object> {
  state: ComboBoxState<T>
  table: Table<T>
}

export function ListBoxBody<T extends object>({
  state,
  table,
}: ListBoxBodyProps<T>) {
  const { rows } = table.getRowModel()

  return (
    <tbody
      style={{
        display: "grid",
        width: "100%",
      }}
    >
      {rows.length > 0 ? (
        rows.map((row: Row<T>) => (
          <TableRowOption key={row.id} row={row} state={state} />
        ))
      ) : (
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
