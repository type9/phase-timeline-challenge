import React, { useCallback, useEffect, useRef } from 'react';
import { useAnimationFrame } from './hooks/useAnimationFrame';
import { KeyTypes } from './constants';

export type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  revertPendingChangeKeycodes?: KeyTypes[];
  triggerBlurKeyCodes?: KeyTypes[];
  selectTextOnChange?: boolean;
  selectTextOnFocus?: boolean;
};

export const NumberInput = ({
  revertPendingChangeKeycodes = ['Escape'],
  triggerBlurKeyCodes = ['Escape', 'Enter'],
  selectTextOnChange = true,
  selectTextOnFocus = true,
  onChange,
  onBlur,
  value,
  ...props
}: NumberInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousValueRef = useRef(value);
  const { scheduleAnimationFrame } = useAnimationFrame();

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    //native event blocker to prevent typing from propagating to onchange event
    //this allows default behaviour like 'enter' to propogate change to work by omission of type onChange triggers
    const handleNativeInput = (event: Event) => {
      event.stopImmediatePropagation();
    };

    inputElement.addEventListener('input', handleNativeInput);

    return () => inputElement.removeEventListener('input', handleNativeInput);
  }, []);

  const revertValue = useCallback(() => {
    if (inputRef.current)
      inputRef.current.value = String(previousValueRef.current);
  }, [inputRef, value]);

  const selectValue = useCallback(
    //animation frame is nessecary to buffer the select of a changing element. alternative is to use setTimeout
    () => scheduleAnimationFrame(() => inputRef.current?.select()),
    [scheduleAnimationFrame, inputRef]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (revertPendingChangeKeycodes.find(key => key === e.key)) revertValue();
      if (triggerBlurKeyCodes.find(key => key === e.key))
        inputRef.current?.blur();
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (selectTextOnChange) selectValue();
    },
    [selectValue, onChange]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      previousValueRef.current = e.target.value;
      if (selectTextOnFocus) selectValue();
    },
    [selectValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) =>
      scheduleAnimationFrame(() => onBlur?.(e)), //needed to properly deselect on blur. otherwise change can happen after blur fires causing a reselect.
    []
  );

  return (
    <input
      ref={inputRef}
      value={value}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      {...props}
    />
  );
};
