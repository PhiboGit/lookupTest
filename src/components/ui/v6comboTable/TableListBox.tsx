// src/components/TableListBox.tsx

import { useRef, type RefObject, useState, useLayoutEffect } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState } from "react-stately"
import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { ListBoxBody } from "./ListBoxBody"

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLDivElement | null>
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  const { listBoxRef, state, table } = props

  // headerRef to calculate scroll padding
  const headerRef = useRef<HTMLTableSectionElement | null>(null)

  // the listbox props and ref have to be with the scrollable container
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  return (
    // The main scrollable container div.
    <div
      {...listBoxProps}
      ref={listBoxRef}
      style={{
        minWidth: 400,
        height: 285, // This makes the container scrollable.
        overflow: "auto", // This makes the container scrollable.
        border: "1px solid #ccc",
        position: "relative", // Needed for the sticky header.
        scrollPaddingTop: headerHeight,
      }}
    >
      {/* 
        We use `display: grid` on the table to allow the `tbody` to grow
        to the full virtualized height while the `thead` remains sticky.
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
                  width: header.getSize(),
                  textAlign: "left",
                  padding: "8px 12px",
                  userSelect: "none",
                  borderBottom: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                    ? "descending"
                    : "none"
                }
                onClick={header.column.getToggleSortingHandler()}
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
          The ListBoxBody component contains the useVirtualizer hook
          and renders the virtualized rows.
        */}
        <ListBoxBody state={state} table={table} listBoxRef={listBoxRef} />
      </table>
    </div>
  )
}
