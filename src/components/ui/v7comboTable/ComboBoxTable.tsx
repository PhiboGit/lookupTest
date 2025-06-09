import { useComboBox } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import { useMemo, useRef, useState } from "react"
import { Popover } from "./Popover"
import { ComboButton } from "./ComboButton"
import { ListBoxTable } from "./ListBoxTable"
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { Input } from "../input" // Assuming you have a custom Input component

interface ComboBoxTableProps<T extends object = object>
  extends ComboBoxStateOptions<T> {
  items: Iterable<T>
  columns: ColumnDef<T>[]
}
export function ComboBoxTable<T extends { id: string | number }>(
  props: ComboBoxTableProps<T>
) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { columns, items } = props
  const data = useMemo(() => Array.from(items || []), [items])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Important for filtering: Process the items before passing them to the ComboBox
  // This is for a client side filter/search
  const processedItems = useMemo(() => {
    return table.getRowModel().rows.map((row) => row.original)
  }, [table.getRowModel().rows])

  const state = useComboBoxState({
    onOpenChange: (isOpen) => {
      // When the combobox is opened, clear the column filters to show all items
      if (isOpen) {
        setColumnFilters([])
      }
    },
    onInputChange: (value) => {
      // When the user types, update the filter for the 'name' column
      setColumnFilters([{ id: "name", value }])
    },
    ...props,
    items: processedItems,
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  )

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <label {...labelProps}>{props.label}</label>
      <div style={{ display: "flex" }}>
        <Input
          {...inputProps}
          ref={inputRef}
          style={{
            height: 24,
            boxSizing: "border-box",
            fontSize: 16,
            flex: 1,
          }}
        />
        <ComboButton
          {...buttonProps}
          buttonRef={buttonRef}
          style={{ height: 24 }}
        >
          <span aria-hidden="true" style={{ padding: "0 2px" }}>
            ▼
          </span>
        </ComboButton>
      </div>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={inputRef}
          popoverRef={popoverRef}
          isNonModal
          placement="bottom start"
        >
          <ListBoxTable
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
            table={table}
          />
        </Popover>
      )}
    </div>
  )
}
