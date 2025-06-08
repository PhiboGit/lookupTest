// src/components/TableListBox.tsx

// FIX: Import useState and useLayoutEffect
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
  listBoxRef: RefObject<HTMLDivElement | null>
  state: ComboBoxState<T>
  table: Table<T>
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  const { listBoxRef, state, table } = props

  const scrollRef = useRef<HTMLDivElement | null>(null)

  // FIX 1: Create a ref for the header and state to store its height.
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  // FIX 2: Measure the header's height after it renders.
  // useLayoutEffect runs synchronously after DOM mutations, preventing a flicker.
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, []) // Empty dependency array means this runs once after initial mount.

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
    // The main scrollable container
    <div
      {...scrollViewProps}
      ref={scrollRef}
      style={{
        minWidth: 400,
        height: 285,
        overflow: "auto",
        border: "1px solid #ccc",
        position: "relative",
        // FIX 3: Apply the measured header height as scroll padding.
        // This ensures that when an item is scrolled into view, it doesn't
        // get hidden under the sticky header.
        scrollPaddingTop: headerHeight,
      }}
    >
      {/* The sticky header */}
      <div
        // Add the headerRef here
        ref={headerRef}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 1,
        }}
        role="row"
      >
        {table.getHeaderGroups()[0].headers.map((header) => (
          <div
            key={header.id}
            role="columnheader"
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
            }}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{ asc: " 🔼", desc: " 🔽" }[
              header.column.getIsSorted() as string
            ] ?? null}
          </div>
        ))}
      </div>

      {/* The virtualized listbox content */}
      <div
        {...listBoxProps}
        ref={listBoxRef}
        style={{
          contain: "size layout style",
          height: virtualizerState.contentSize.height,
          width: "100%",
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
          <div
            style={{
              padding: "8px 12px",
              color: "#888",
              textAlign: "center",
            }}
          >
            No results found.
          </div>
        )}
      </div>
    </div>
  )
}
