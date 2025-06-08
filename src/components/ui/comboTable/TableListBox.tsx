import { useRef, type RefObject } from "react"
import { useListBox, type AriaListBoxOptions } from "react-aria"
import type { ComboBoxState } from "react-stately"
import { TableRowOption } from "./TableRowOption" // We will create this

interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  listBoxRef: RefObject<HTMLUListElement | null>
  state: ComboBoxState<T>
}

export function TableListBox<T extends object>(props: ListBoxProps<T>) {
  const ref = useRef<HTMLUListElement | null>(null)
  const { listBoxRef = ref, state } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  // Common styles for header cells and row cells for alignment
  const cellStyle: React.CSSProperties = {
    padding: "8px 12px",
    flex: 1, // Each cell takes equal space
    borderBottom: "1px solid #ccc",
  }

  return (
    <div style={{ minWidth: 400 }}>
      {/* Visual-only Table Header */}
      <div
        onMouseDown={(e) => e.preventDefault()} // Prevent text selection
        style={{
          display: "flex",
          fontWeight: "bold",
          background: "#f0f0f0",
          color: "#333",
        }}
      >
        <div style={{ ...cellStyle }}>Name</div>
        <div style={cellStyle}>Class</div>
        <div style={cellStyle}>Diet</div>
      </div>

      {/* The ListBox itself, which is a UL with role="listbox" */}
      <ul
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
        {[...state.collection].map((item) => (
          // We pass the full item and state to our custom row component
          <TableRowOption
            key={item.key}
            item={item} // Cast to any to handle our specific data shape in TableRowOption
            state={state}
          />
        ))}
      </ul>
    </div>
  )
}
