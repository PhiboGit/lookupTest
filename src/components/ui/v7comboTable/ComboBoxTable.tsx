import { useButton, useComboBox } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import { useMemo, useRef, useState } from "react"
import { Popover } from "./Popover"
import { ComboButton } from "./ComboButton"
import { ListBoxTable } from "./ListBoxTable"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { Input } from "../input"
import { Button } from "../button"

interface ComboBoxTableProps<T extends object = object>
  extends ComboBoxStateOptions<T> {
  items: Iterable<T>
  columns: ColumnDef<T>[]
}

export function ComboBoxTable<T extends { id: string | number }>(
  props: ComboBoxTableProps<T>
) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const { columns, items } = props
  const data = useMemo(() => Array.from(items || []), [items])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const processedItems = useMemo(() => {
    return table.getRowModel().rows.map((row) => row.original)
  }, [table.getRowModel().rows])

  const state = useComboBoxState({
    onOpenChange: (isOpen) => {
      // When the combobox is opened, clear the filter to show all items
      if (isOpen) {
        setGlobalFilter("")
      }
    },
    onInputChange: (value) => {
      setGlobalFilter(value)
    },
    ...props,
    items: processedItems,
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const {
    buttonProps: comboButtonProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  )
  const { buttonProps } = useButton(comboButtonProps, buttonRef)
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
        <Button {...buttonProps} ref={buttonRef} style={{ height: 24 }}>
          <span aria-hidden="true" style={{ padding: "0 2px" }}>
            ▼
          </span>
        </Button>
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
