import React from "react"

export interface SelectableContextValue {
  // State
  selectionMode: "single" | "multiple"
  focusedRowId: string | null
  selectedRowIds: Set<string>
  registeredRowIds: string[] // Ordered list of all available row IDs for navigation

  // Updaters
  setFocusedRowId: (id: string | null) => void
  toggleRowSelection: (id: string) => void // For multi-select or initiating selection
  selectRow: (id: string) => void // For single-select (selects one, deselects others)
  setRegisteredRowIds: (ids: string[]) => void // Called by TableBody to list available rows

  // Refs for ARIA attributes (passed down from Selectable.Table)
  getTableId: () => string | undefined // For aria-controls, aria-labelledby etc. if needed
  getBodyId: () => string | undefined // For aria-activedescendant target
}

export const SelectableContext = React.createContext<
  SelectableContextValue | undefined
>(undefined)

export const useSelectableContext = () => {
  const context = React.useContext(SelectableContext)
  if (!context) {
    throw new Error(
      "useSelectableContext must be used within a Selectable.Root"
    )
  }
  return context
}
