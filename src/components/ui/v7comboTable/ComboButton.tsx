import { useButton, type AriaButtonOptions } from "react-aria"
import { Button } from "../button"

//@ts-expect-error onBlur error
interface ComboButtonProps
  extends AriaButtonOptions<"button">,
    React.HTMLAttributes<HTMLButtonElement> {
  buttonRef: React.RefObject<HTMLButtonElement | null>
}
export function ComboButton(props: ComboButtonProps) {
  const ref = props.buttonRef
  const { buttonProps } = useButton(props, ref)
  return (
    <Button {...buttonProps} ref={ref} style={props.style}>
      {props.children}
    </Button>
  )
}
