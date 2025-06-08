import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils" // Assuming ShadCN's utility

import "./adornment.css"
// --- AdornmentItem ---
interface AdornmentItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const AdornmentItem = React.forwardRef<HTMLDivElement, AdornmentItemProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(
          "adornment-item", // DEDICATED CLASS for easier CSS targeting
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
AdornmentItem.displayName = "AdornmentItem"

// --- Adornment (Wrapper) ---
interface AdornmentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const Adornment = React.forwardRef<HTMLDivElement, AdornmentProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        className={cn(
          "adornment-wrapper", // Dedicated class
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", // Focus state
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Adornment.displayName = "Adornment"

const RootAdornment = Adornment as typeof Adornment & {
  Item: typeof AdornmentItem
}
RootAdornment.Item = AdornmentItem

export { RootAdornment as Adornment, AdornmentItem }
