// Selectable.tsx (or SelectableRoot.tsx)
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from "react"
import { Slot } from "@radix-ui/react-slot"
import { Table, TableBody, TableRow } from "@/components/ui/table"
import {
  SelectableContext,
  type SelectableContextValue,
  useSelectableContext,
} from "./SelectableContext"
import { useControllableState } from "./use-controllable-state"
import "./selectable.css"

// --- Root Component ---
interface SelectableRootProps {
  children: React.ReactNode
  selectionMode?: "single" | "multiple"
  // Controlled selection
  selectedRowIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  initialSelectedRowIds?: string[]
  // Controlled focus
  focusedRowId?: string | null
  onFocusChange?: (focusedId: string | null) => void
  initialFocusedRowId?: string | null
}

const Root: React.FC<SelectableRootProps> = ({
  children,
  selectionMode: selectionModeProp = "single",
  selectedRowIds: selectedRowIdsProp,
  onSelectionChange,
  initialSelectedRowIds = [],
  focusedRowId: focusedRowIdProp,
  onFocusChange,
  initialFocusedRowId = null,
}) => {
  const [registeredRowIds, setRegisteredRowIdsState] = useState<string[]>([])
  const tableId = React.useId()
  const bodyId = React.useId()

  const [currentSelectedIdsSet, setCurrentSelectedIdsSet] =
    useControllableState<Set<string>>({
      prop: selectedRowIdsProp ? new Set(selectedRowIdsProp) : undefined,
      defaultProp: new Set(initialSelectedRowIds),
      onChange: (newSet) => {
        onSelectionChange?.(Array.from(newSet))
      },
    })

  const [currentFocusedRowId, setCurrentFocusedRowId] = useControllableState<
    string | null
  >({
    prop: focusedRowIdProp,
    defaultProp: initialFocusedRowId,
    onChange: (newId) => {
      onFocusChange?.(newId)
    },
  })

  const handleSetFocusedRowId = useCallback(
    (id: string | null) => {
      setCurrentFocusedRowId(id)
    },
    [setCurrentFocusedRowId]
  )

  const handleToggleRowSelection = useCallback(
    (id: string) => {
      setCurrentSelectedIdsSet((prevSet) => {
        const newSet = new Set(prevSet)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          if (selectionModeProp === "single") {
            newSet.clear()
          }
          newSet.add(id)
        }
        return newSet
      })
    },
    [setCurrentSelectedIdsSet, selectionModeProp]
  )

  const handleSelectRow = useCallback(
    (id: string) => {
      // Primarily for single select
      setCurrentSelectedIdsSet(() => {
        const newSet = new Set<string>()
        newSet.add(id)
        return newSet
      })
    },
    [setCurrentSelectedIdsSet]
  )

  const contextValue: SelectableContextValue = useMemo(
    () => ({
      selectionMode: selectionModeProp,
      focusedRowId: currentFocusedRowId!,
      selectedRowIds: currentSelectedIdsSet!,
      registeredRowIds,
      setFocusedRowId: handleSetFocusedRowId,
      toggleRowSelection: handleToggleRowSelection,
      selectRow: handleSelectRow,
      setRegisteredRowIds: setRegisteredRowIdsState,
      getTableId: () => `selectable-table-${tableId}`,
      getBodyId: () => `selectable-table-body-${bodyId}`,
    }),
    [
      selectionModeProp,
      currentFocusedRowId,
      currentSelectedIdsSet,
      registeredRowIds,
      handleSetFocusedRowId,
      handleToggleRowSelection,
      handleSelectRow,
      tableId,
      bodyId,
    ]
  )

  return (
    <SelectableContext.Provider value={contextValue}>
      {children}
    </SelectableContext.Provider>
  )
}
Root.displayName = "Selectable.Root"

// --- SelectableTableBody Component ---
interface SelectableTableBodyProps
  extends React.ComponentProps<typeof TableBody> {}

const SelectableTableBody: React.FC<SelectableTableBodyProps> = ({
  children,
  ref,
  ...props
}) => {
  const context = useSelectableContext()
  const bodyRef = useRef<HTMLTableSectionElement>(null)
  // Expose the internal ref to parent via forwarded ref
  useImperativeHandle(ref, () => bodyRef.current!, [])

  // Register all row IDs from children
  React.useEffect(() => {
    const ids: string[] = []
    React.Children.forEach(children, (child) => {
      // Assuming Selectable.Row is a direct child and has a rowId prop
      if (
        React.isValidElement(child) &&
        (child.type as any).displayName === "Selectable.Row" &&
        child.props.rowId
      ) {
        ids.push(child.props.rowId as string)
      }
    })
    context.setRegisteredRowIds(ids)
  }, [children, context.setRegisteredRowIds])

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableSectionElement>
  ) => {
    if (!context.registeredRowIds.length) return

    let currentFocusIndex = context.focusedRowId
      ? context.registeredRowIds.indexOf(context.focusedRowId)
      : -1

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        currentFocusIndex = Math.min(
          currentFocusIndex + 1,
          context.registeredRowIds.length - 1
        )
        if (currentFocusIndex === -1 && context.registeredRowIds.length > 0)
          currentFocusIndex = 0 // Focus first if none focused
        context.setFocusedRowId(context.registeredRowIds[currentFocusIndex])
        break
      case "ArrowUp":
        event.preventDefault()
        currentFocusIndex = Math.max(currentFocusIndex - 1, 0)
        context.setFocusedRowId(context.registeredRowIds[currentFocusIndex])
        break
      case "Home":
        event.preventDefault()
        context.setFocusedRowId(context.registeredRowIds[0])
        break
      case "End":
        event.preventDefault()
        context.setFocusedRowId(
          context.registeredRowIds[context.registeredRowIds.length - 1]
        )
        break
      case "Enter":
        event.preventDefault()
        if (context.focusedRowId) {
          if (context.selectionMode === "single") {
            context.selectRow(context.focusedRowId)
          } else {
            // multi-select
            context.toggleRowSelection(context.focusedRowId)
          }
        }
        break
      default:
        break
    }
  }

  return (
    <TableBody
      ref={bodyRef}
      id={context.getBodyId()}
      tabIndex={0} // Make the body focusable
      onKeyDown={handleKeyDown}
      aria-activedescendant={
        context.focusedRowId
          ? `selectable-row-${context.focusedRowId}`
          : undefined
      }
      {...props}
    >
      {children}
    </TableBody>
  )
}
SelectableTableBody.displayName = "Selectable.TableBody"

// --- SelectableTableRow Component ---
interface SelectableTableRowProps
  extends React.ComponentProps<typeof TableRow> {
  rowId: string
}

const SelectableTableRow: React.FC<SelectableTableRowProps> = ({
  rowId,
  children,
  className,
  ...props
}) => {
  const context = useSelectableContext()
  const isSelected = context.selectedRowIds.has(rowId)
  const isFocused = context.focusedRowId === rowId

  const handleClick = () => {
    context.setFocusedRowId(rowId) // Always focus on click
    if (context.selectionMode === "single") {
      context.selectRow(rowId)
    } else {
      // multi-select
      context.toggleRowSelection(rowId) // As per requirement: "Simple click toggles selection"
    }
  }

  const uniqueRowDomId = `selectable-row-${rowId}`

  return (
    <TableRow
      id={uniqueRowDomId}
      aria-selected={isSelected}
      data-selected={isSelected}
      data-focused={isFocused} // For styling the focused row
      onClick={handleClick}
      // Add a class for easier styling if needed, or use data-attributes
      className={`${className || ""} ${isFocused ? "row-focused" : ""} ${
        isSelected ? "row-selected" : ""
      } cursor-pointer`}
      {...props}
    >
      {children}
    </TableRow>
  )
}
SelectableTableRow.displayName = "Selectable.Row"

// --- Selectable Wrapper for Shadcn Table ---
// This component mainly sets up aria-multiselectable
interface SelectableTableProps extends React.ComponentProps<typeof Table> {
  asChild?: boolean
}

const SelectableTableWrapper: React.FC<SelectableTableProps> = ({
  children,
  asChild,
  ...props
}) => {
  const context = useSelectableContext()
  const Comp = asChild ? Slot : Table
  return (
    <Comp
      id={context.getTableId()}
      aria-multiselectable={context.selectionMode === "multiple"}
      {...props}
    >
      {children}
    </Comp>
  )
}
SelectableTableWrapper.displayName = "Selectable.Table"

// Exporting the compound components
export const Selectable = {
  Root,
  Table: SelectableTableWrapper,
  Body: SelectableTableBody,
  Row: SelectableTableRow,
}
