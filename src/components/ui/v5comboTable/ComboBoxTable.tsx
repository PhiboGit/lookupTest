import { useComboBox } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import { useMemo, useRef, useState } from "react"
import { Popover } from "./Popover"
import { ComboButton } from "./ComboButton"
import { TableListBox } from "./TableListBox"
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

// ... Animal interface and columns definition remain the same ...
interface Animal {
  id: number
  name: string
  class: string
  diet: string
}
const columns: ColumnDef<Animal>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div>
          <strong>{row.original.id}</strong> {row.original.name}
        </div>
      )
    },
  },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "diet", header: "Diet" },
]

export function ComboBoxTable(props: ComboBoxStateOptions<Animal>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const data = useMemo(() => Array.from(props.items || []), [props.items])

  const table = useReactTable({
    data,
    columns,
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

  const processedItems = useMemo(() => {
    return table.getRowModel().rows.map((row) => row.original)
  }, [table.getRowModel().rows])

  const state = useComboBoxState({
    ...props,
    items: processedItems,
    onOpenChange: (isOpen) => {
      if (isOpen) {
        setColumnFilters([])
      }
    },
    onInputChange: (value) => {
      // When the user types, update the filter for the 'name' column
      setColumnFilters([{ id: "name", value }])
    },
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
      {/* To show an "is empty" Text */}
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={inputRef}
          popoverRef={popoverRef}
          isNonModal
          placement="bottom start"
        >
          <TableListBox
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
