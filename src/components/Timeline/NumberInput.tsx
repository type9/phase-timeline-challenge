import React, { useCallback, useEffect, useRef } from 'react';
import { KeyTypes } from './constants';

export type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  revertPendingChangeKeyCodes?: KeyTypes[];
  triggerBlurKeyCodes?: KeyTypes[];
  revertNonNumerics?: boolean;
  selectTextOnChange?: boolean;
  selectTextOnFocus?: boolean;
};

export const NumberInput = ({
  revertPendingChangeKeyCodes = ['Escape'],
  triggerBlurKeyCodes = ['Escape', 'Enter'],
  revertNonNumerics = true,
  selectTextOnChange = true,
  selectTextOnFocus = true,
  onChange,
  value,
  ...props
}: NumberInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousValueRef = useRef(value);

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

  const selectValue = useCallback(() => {
    //ensures input is focused before selecting
    if (inputRef.current && document.activeElement === inputRef.current)
      inputRef.current.select();
  }, [inputRef]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (revertPendingChangeKeyCodes.find(key => key === e.key)) revertValue();
      if (triggerBlurKeyCodes.find(key => key === e.key))
        inputRef.current?.blur();
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //naive implementation of non-numeric input detection.
      if (revertNonNumerics && isNaN(parseFloat(e.target.value))) revertValue();
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
  return (
    <input
      ref={inputRef}
      value={value}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      {...props}
    />
  );
};
