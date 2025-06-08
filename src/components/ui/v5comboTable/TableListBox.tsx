// src/components/TableListBox.tsx

import React, { useState, useLayoutEffect, useRef, type RefObject } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import { useVirtualizerState } from "@react-stately/virtualizer"
import { useScrollView } from "@react-aria/virtualizer"
import type { ComboBoxState, Node } from "react-stately"
import { ListLayout } from "@react-stately/layout"
import { TableRowOption } from "./TableRowOption"
import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLTableSectionElement | null> // Ref is now on a <tbody>
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  // Note: The listBoxRef type has been updated in the interface above.
  const { listBoxRef, state, table } = props

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLTableSectionElement | null>(null) // Ref is now on a <thead>
  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  // useListBox now manages a <tbody> element
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  const layout = new ListLayout<T>({ rowHeight: 35 })

  const virtualizerState = useVirtualizerState<Node<T>, React.ReactNode>({
    collection: state.collection,
    layout,
    onVisibleRectChange: () => {},
    renderView: (type, item) => item?.rendered,
  })

  const { scrollViewProps } = useScrollView(
    {
      contentSize: virtualizerState.contentSize,
      onVisibleRectChange: virtualizerState.setVisibleRect,
      onScrollStart: virtualizerState.startScrolling,
      onScrollEnd: virtualizerState.endScrolling,
    },
    scrollRef
  )

  return (
    // The main scrollable container div remains.
    <div
      {...scrollViewProps}
      ref={scrollRef}
      style={{
        minWidth: 400,
        height: 285,
        overflow: "auto",
        border: "1px solid #ccc",
        position: "relative",
        scrollPaddingTop: headerHeight,
      }}
    >
      {/* SEMANTIC CHANGE: Using a <table> for the structured data. */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {/* SEMANTIC CHANGE: Using <thead> for the sticky header. */}
        <thead
          ref={headerRef}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1,
          }}
        >
          {/* SEMANTIC CHANGE: A table row for headers. */}
          <tr>
            {table.getHeaderGroups()[0].headers.map((header) => (
              // SEMANTIC CHANGE: <th> for semantic header cells.
              // The `role` is no longer needed.
              <th
                key={header.id}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                    ? "descending"
                    : "none"
                }
                style={{
                  width: header.getSize(),
                  textAlign: "left",
                  padding: "8px 12px",
                  cursor: header.column.getCanSort() ? "pointer" : "default",
                  userSelect: "none",
                  // The border is now applied here for a cleaner look.
                  borderBottom: "1px solid #ccc",
                }}
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
        {/* SEMANTIC CHANGE: <tbody> is the listbox container for options. */}
        {/* It receives the ARIA props from useListBox and the virtualization styles. */}
        <tbody
          {...listBoxProps}
          ref={listBoxRef}
          style={{
            height: virtualizerState.contentSize.height,
            position: "relative",
          }}
        >
          {virtualizerState.visibleViews.map(
            (view) =>
              view.content && (
                <TableRowOption
                  key={view.key}
                  view={view}
                  state={state}
                  table={table}
                />
              )
          )}
          {state.collection.size === 0 && (
            // The "No results" message must be inside a <tr> and <td>
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
      </table>
    </div>
  )
}
