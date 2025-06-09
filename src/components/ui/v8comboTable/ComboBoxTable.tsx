// src/components/ComboBoxTable/ComboBoxTable.tsx

import { useButton, useComboBox } from "react-aria"
import { useComboBoxState, type ComboBoxStateOptions } from "react-stately"
import React, { useMemo, useRef, useState, type RefObject } from "react"
import { Popover } from "./Popover" // Assuming Popover is in a parent directory

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
import { ComboBoxTableContext, useComboBoxTable } from "./ComboBoxTableContext"
import { ComboboxItem } from "./ComboboxItem"
import { ListBoxTable } from "./ListBoxTable"

// --- Root Component Props ---
interface ComboBoxTableProps<T extends object = object>
  extends Omit<ComboBoxStateOptions<T>, "children"> {
  items: Iterable<T>
  columns: ColumnDef<T>[]
  item: (item: T) => { key: React.Key; textValue: string }
  children?: React.ReactNode
}

// --- Root Component ---
function ComboBoxTable<T extends object>(props: ComboBoxTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const { columns, items, item } = props
  const data = useMemo(() => Array.from(items || []), [items])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(item(row).key),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const processedItems = useMemo(
    () => table.getRowModel().rows.map((row) => row.original),
    [table.getRowModel().rows]
  )

  const state = useComboBoxState({
    ...props,
    children: (i) => (
      <ComboboxItem key={item(i).key} textValue={item(i).textValue} />
    ),
    items: processedItems,
    onOpenChange: (isOpen, trigger) => {
      if (isOpen) setGlobalFilter("")
      props.onOpenChange?.(isOpen, trigger)
    },
    onInputChange: (value) => {
      setGlobalFilter(value)
      props.onInputChange?.(value)
    },
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    { ...props, inputRef, buttonRef, listBoxRef, popoverRef },
    state
  )

  const contextValue = {
    state,
    table,
    inputRef,
    buttonRef,
    listBoxRef,
    popoverRef,
    labelProps,
    inputProps,
    buttonProps,
    listBoxProps,
    label: props.label,
  }

  return (
    <ComboBoxTableContext.Provider value={contextValue}>
      <div style={{ display: "inline-flex", flexDirection: "column" }}>
        {props.children}
      </div>
    </ComboBoxTableContext.Provider>
  )
}

// --- Input Component ---
function ComboBoxTableInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { inputProps, inputRef } = useComboBoxTable()
  return (
    <Input
      {...inputProps}
      {...props}
      ref={inputRef}
      style={{
        height: 24,
        boxSizing: "border-box",
        fontSize: 16,
        flex: 1,
        ...props.style,
      }}
    />
  )
}

// --- Button Component ---
function ComboBoxTableButton({ children }: { children?: React.ReactNode }) {
  const { buttonProps: comboButtonProps, buttonRef } = useComboBoxTable()
  // useButton is still needed to apply press/hover interactions
  const { buttonProps } = useButton(comboButtonProps, buttonRef)

  return (
    <Button
      {...buttonProps}
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      style={{ height: 24 }}
    >
      {children ?? (
        <span aria-hidden="true" style={{ padding: "0 2px" }}>
          ▼
        </span>
      )}
    </Button>
  )
}

// --- Popover Component ---
function ComboBoxTablePopover({ children }: { children?: React.ReactNode }) {
  const { state, inputRef, popoverRef } = useComboBoxTable()

  if (!state.isOpen) {
    return null
  }

  return (
    <Popover
      state={state}
      triggerRef={inputRef}
      popoverRef={popoverRef}
      isNonModal
      placement="bottom start"
    >
      {/*
        In the next step, we will likely refactor ListBoxTable to be a child component
        that also consumes our context, e.g., <ComboBoxTable.ListBox />
      */}
      {children}
    </Popover>
  )
}

const ComboBoxListBox = () => {
  const { listBoxProps, listBoxRef, state, table } = useComboBoxTable()
  return (
    <ListBoxTable
      {...listBoxProps}
      listBoxRef={listBoxRef as RefObject<HTMLDivElement>}
      state={state}
      table={table}
    />
  )
}

// --- Label Component ---
function ComboBoxTableLabel(
  props: React.LabelHTMLAttributes<HTMLLabelElement>
) {
  const { labelProps, label } = useComboBoxTable()
  return (
    <label {...labelProps} {...props}>
      {label}
    </label>
  )
}

// Assign child components as properties of the main component
ComboBoxTable.Input = ComboBoxTableInput
ComboBoxTable.Button = ComboBoxTableButton
ComboBoxTable.Popover = ComboBoxTablePopover
ComboBoxTable.ListBox = ComboBoxListBox
ComboBoxTable.Label = ComboBoxTableLabel

export { ComboBoxTable }
