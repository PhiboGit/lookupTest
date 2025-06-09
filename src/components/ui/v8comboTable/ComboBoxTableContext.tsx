// src/components/ComboBoxTable/ComboBoxTableContext.ts
import {
  createContext,
  useContext,
  type DOMAttributes,
  type InputHTMLAttributes,
  type RefObject,
} from "react"
import type { ComboBoxState } from "react-stately"
import type { AriaButtonProps, AriaListBoxOptions } from "react-aria"
import type { FocusableElement } from "@react-types/shared"
import type { Table } from "@tanstack/react-table"

// Define the shape of our context value
interface ComboBoxTableContextValue<T extends object = object> {
  // State and instances
  table: Table<T>

  inputRef: RefObject<HTMLInputElement | null>
  popoverRef: RefObject<Element | null>
  listBoxRef: RefObject<HTMLElement | null>
  buttonRef: RefObject<Element | null>
  state: ComboBoxState<T>

  labelProps: DOMAttributes<FocusableElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
  listBoxProps: AriaListBoxOptions<T>
  buttonProps: AriaButtonProps<"button">

  // Original props passed to the root
  label?: React.ReactNode
}

// Create the context with a null default value
export const ComboBoxTableContext = createContext<
  // createContext call cannot be made fully generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComboBoxTableContextValue<any> | undefined
>(undefined)

// Custom hook for consuming the context
export function useComboBoxTable<T extends object>() {
  const context = useContext(ComboBoxTableContext)
  if (!context) {
    throw new Error(
      "useComboBoxTable must be used within a ComboBoxTable provider"
    )
  }
  return context as ComboBoxTableContextValue<T>
}
