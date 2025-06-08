import { Item as StatelyItem, type ItemProps } from "react-stately"

/**
 * A type that takes the original ItemProps and makes the `children` prop optional.
 * We use Omit to remove the original `children` definition and then add it back as optional.
 * This is more robust than just `Partial<ItemProps>` as it keeps other props like `key` required.
 */
type ComboboxItemProps<T> = Omit<ItemProps<T>, "children"> & {
  children?: React.ReactNode
}

/**
 * A custom Item component for React Aria collections that does not require children.
 *
 * This is useful when the rendering of the item is handled completely by another
 * system (like TanStack Table), and we only need the Item for its data-collection
 * properties (`key`, `textValue`, etc.).
 *
 * It acts as a wrapper around the original `Item` from `react-stately`,
 * satisfying the `children` prop requirement internally with `null`.
 */
export function ComboboxItem<T extends object>(props: ComboboxItemProps<T>) {
  // Render the original Item from react-stately, passing all props
  // through and providing `null` to satisfy the mandatory `children` prop.
  return <StatelyItem {...props}>{null}</StatelyItem>
}

// Manually attach the static `getCollectionNode` generator function from the
// original `StatelyItem` to our custom `Item` wrapper. This makes our
// component compatible with React Aria's collection builder, which expects
// this static method to exist on collection components.
//
// We can ignore the TypeScript error here as we are intentionally
// modifying the function object to mimic the behavior of the library component.
// @ts-expect-error intentionally modifying
ComboboxItem.getCollectionNode = StatelyItem.getCollectionNode
