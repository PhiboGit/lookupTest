import {
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox,
  type AriaTableCellProps,
  type AriaTableColumnHeaderProps,
  type AriaTableProps,
  type GridRowProps,
} from "@react-aria/table"
import {
  useTableState,
  type TableState,
  type TableStateProps,
  type Node,
} from "react-stately"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useFocusRing } from "@react-aria/focus"
import { useRef } from "react"
import { mergeProps } from "@react-aria/utils"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { Checkbox } from "../ui/checkbox"

export interface DataGridProps<T extends object>
  extends TableStateProps<T>,
    AriaTableProps,
    Omit<React.HTMLAttributes<HTMLTableElement>, "children"> {}
export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const { selectionMode, selectionBehavior } = props
  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === "multiple" && selectionBehavior !== "replace",
  })

  const ref = useRef<HTMLTableElement | null>(null)
  const { collection } = state
  const { gridProps } = useTable<T>(props, state, ref)

  return (
    <Table
      {...gridProps}
      ref={ref}
      style={{
        borderCollapse: "collapse",
        ...gridProps.style,
        ...props.style,
      }}
      className={props.className}
    >
      <DataGridHeader>
        {collection.headerRows.map((headerRow) => (
          <DataGridHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <DataGridSelectAllCell
                  key={column.key}
                  column={{ isVirtualized: true, node: column }}
                  state={state}
                />
              ) : (
                <DataGridHeadCell
                  key={column.key}
                  column={{ isVirtualized: true, node: column }}
                  state={state}
                />
              )
            )}
          </DataGridHeaderRow>
        ))}
      </DataGridHeader>
      <DataGridBody>
        {[...collection.body.childNodes].map((row) => (
          <DataGridRow key={row.key} item={{ node: row }} state={state}>
            {[...row.childNodes].map((cell) =>
              cell.props.isSelectionCell ? (
                <DataGridCheckboxCell
                  key={cell.key}
                  cell={{ isVirtualized: true, node: cell }}
                  state={state}
                />
              ) : (
                <DataGridCell
                  key={cell.key}
                  cell={{ isVirtualized: true, node: cell }}
                  state={state}
                />
              )
            )}
          </DataGridRow>
        ))}
      </DataGridBody>
    </Table>
  )
}

export function DataGridHeader({ children }: { children: React.ReactNode }) {
  const { rowGroupProps } = useTableRowGroup()
  return (
    <TableHeader
      {...rowGroupProps}
      style={{
        borderBottom: "2px solid var(--spectrum-global-color-gray-800)",
      }}
    >
      {children}
    </TableHeader>
  )
}

export function DataGridBody({ children }: { children: React.ReactNode }) {
  const { rowGroupProps } = useTableRowGroup()
  return <TableBody {...rowGroupProps}>{children}</TableBody>
}

export function DataGridHeaderRow<T>({
  item,
  state,
  children,
}: {
  item: Node<T>
  state: TableState<unknown>
  children: React.ReactNode
}) {
  const ref = useRef<HTMLTableRowElement | null>(null)
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref)

  return (
    <TableRow {...rowProps} ref={ref}>
      {children}
    </TableRow>
  )
}

export function DataGridHeadCell<T>({
  column,
  state,
}: {
  column: AriaTableColumnHeaderProps<T>
  state: TableState<T>
}) {
  const ref = useRef<HTMLTableCellElement | null>(null)
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column.node },
    state,
    ref
  )
  const { isFocusVisible, focusProps } = useFocusRing()
  const arrowIcon = state.sortDescriptor?.direction === "ascending" ? "▲" : "▼"

  return (
    <TableHead
      {...mergeProps(columnHeaderProps, focusProps)}
      style={{
        textAlign: "left",
        padding: "5px 10px",
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
        cursor: "default",
      }}
      ref={ref}
    >
      {column.node.rendered}
      {column.node.props.allowsSorting && (
        <span
          aria-hidden="true"
          style={{
            padding: "0 2px",
            visibility:
              state.sortDescriptor?.column === column.node.key
                ? "visible"
                : "hidden",
          }}
        >
          {arrowIcon}
        </span>
      )}
    </TableHead>
  )
}

export function DataGridRow<T>({
  item,
  state,
  children,
}: {
  item: GridRowProps<T>
  state: TableState<T>
  children: React.ReactNode
}) {
  const ref = useRef<HTMLTableRowElement | null>(null)
  const isSelected = state.selectionManager.isSelected(item.node.key)
  const { rowProps, isPressed } = useTableRow(
    {
      node: item.node,
    },
    state,
    ref
  )
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <TableRow
      style={{
        background: isSelected
          ? "blueviolet"
          : isPressed
          ? "var(--spectrum-global-color-gray-400)"
          : item.node.index % 2
          ? "var(--spectrum-alias-highlight-hover)"
          : "none",
        color: isSelected ? "white" : undefined,
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
        cursor: "default",
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </TableRow>
  )
}

export function DataGridCell<T>({
  cell,
  state,
}: {
  cell: AriaTableCellProps
  state: TableState<T>
}) {
  const ref = useRef<HTMLTableCellElement | null>(null)
  const { gridCellProps } = useTableCell({ node: cell.node }, state, ref)
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <TableCell
      {...mergeProps(gridCellProps, focusProps)}
      style={{
        padding: "5px 10px",
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
      }}
      ref={ref}
    >
      {cell.node.rendered}
    </TableCell>
  )
}

function DataGridSelectAllCell<T>({
  column,
  state,
}: {
  column: AriaTableColumnHeaderProps<T>
  state: TableState<T>
}) {
  const ref = useRef<HTMLTableCellElement | null>(null)
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column.node },
    state,
    ref
  )
  const { checkboxProps } = useTableSelectAllCheckbox(state)
  const { isIndeterminate, onChange, ...checkboxPropss } = checkboxProps
  return (
    <th {...columnHeaderProps} ref={ref}>
      {state.selectionManager.selectionMode === "single" ? (
        <VisuallyHidden>{checkboxProps["aria-label"]}</VisuallyHidden>
      ) : (
        <Checkbox
          checked={isIndeterminate ? "indeterminate" : checkboxProps.isSelected}
          onCheckedChange={onChange}
          {...checkboxPropss}
        />
      )}
    </th>
  )
}

function DataGridCheckboxCell<T>({
  cell,
  state,
}: {
  cell: AriaTableCellProps
  state: TableState<T>
}) {
  const ref = useRef<HTMLTableCellElement | null>(null)
  const { gridCellProps } = useTableCell({ node: cell.node }, state, ref)
  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.node.parentKey! },
    state
  )
  const { isIndeterminate, onChange, ...checkboxPropss } = checkboxProps
  return (
    <td {...gridCellProps} ref={ref}>
      <Checkbox
        checked={isIndeterminate ? "indeterminate" : checkboxProps.isSelected}
        onCheckedChange={onChange}
        {...checkboxPropss}
      />
    </td>
  )
}
