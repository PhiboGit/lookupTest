// https://jjenzz.com/component-control-freak/
// co-created @radix_ui primitives
import React from 'react';

type UseControllableStateParams<T> = {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
};

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledState, setUncontrolledState] = React.useState<T | undefined>(defaultProp);
  // whether consumer is trying to control it or not. we use a ref because
  // components should not switch between controlled/uncontrolled at runtime
  const isControlled = React.useRef(prop !== undefined).current;
  const value = isControlled ? prop : uncontrolledState;
  const handleChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    handleChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T | undefined>) => {
      const resolvedNextValue = typeof nextValue === 'function'
        // @ts-expect-error // TypeScript doesn't know that nextValue is a function
        ? nextValue(value)
        : nextValue;

      if (!isControlled) {
        setUncontrolledState(resolvedNextValue);
      }
      handleChangeRef.current(resolvedNextValue);
    },
    [isControlled, handleChangeRef, value]
  );

  return [value, setValue] as const;
}