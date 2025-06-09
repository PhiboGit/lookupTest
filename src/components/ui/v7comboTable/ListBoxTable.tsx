// src/components/TableListBox.tsx

import { useRef, type RefObject, useState, useLayoutEffect } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState } from "react-stately"
import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { ListBoxBody } from "./ListBoxBody"

interface ListBoxTableProps<T extends object = object>
  extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLDivElement | null>
  state: ComboBoxState<T>
  table: Table<T>
}

export function ListBoxTable<T extends object>(props: ListBoxTableProps<T>) {
  const defaultRef = useRef<HTMLDivElement | null>(null)
  const { listBoxRef = defaultRef, state, table } = props

  const headerRef = useRef<HTMLTableSectionElement | null>(null) // Ref is now on a <thead>

  // the listbox props and ref have to be with the scrollable container
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  return (
    <>
      {/* The main scrollable container div. */}
      <div
        {...listBoxProps}
        ref={listBoxRef}
        style={{
          minWidth: 400,
          height: 300,
          overflow: "auto", // This makes the container scrollable.
          position: "relative", // Needed for the sticky header.
          scrollPaddingTop: headerHeight,
        }}
      >
        {/*
        We use `display: grid` on the table to allow the `thead` to remain sticky
        while the `tbody` scrolls underneath it.
        */}
        <table style={{ display: "grid", width: "100%" }}>
          <thead
            ref={headerRef}
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 1,
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevents focus loss from combobox
          >
            {/* The header row uses flexbox to align with the data rows */}
            <tr style={{ display: "flex", width: "100%" }}>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    display: "flex",
                    padding: "8px 12px",
                    width: header.getSize(),
                  }}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                      ? "descending"
                      : "none"
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  className={
                    header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{ asc: " 🔼", desc: " 🔽" }[
                    header.column.getIsSorted() as string
                  ] ?? null}
                </th>
              ))}
            </tr>
          </thead>
          {/*
          The ListBoxBody component now renders all items directly.
          */}
          <ListBoxBody state={state} table={table} />
        </table>
      </div>
      <div>Footer</div>
    </>
  )
}
