import { DismissButton, Overlay, usePopover } from "react-aria"
import type { AriaPopoverProps } from "react-aria"
import type { OverlayTriggerState } from "react-stately"

interface PopoverProps extends AriaPopoverProps {
  children: React.ReactNode
  state: OverlayTriggerState
}

export function Popover({ children, state, ...props }: PopoverProps) {
  const { popoverProps } = usePopover(props, state)

  return (
    <Overlay>
      <div
        {...popoverProps}
        ref={props.popoverRef as React.RefObject<HTMLDivElement>}
        style={{
          ...popoverProps.style,
          background: "lightgray",
          border: "1px solid gray",
        }}
      >
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  )
}
