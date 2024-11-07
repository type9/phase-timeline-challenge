import { forwardRef } from 'react';

export type NumberInputProps = {
  playheadTime: number;
  durationTime: number;
  stateDep: any;
  onCurrentTimeInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onCurrentTimeKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentTime: number
  ) => void;
  onCurrentTimeBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onDurationTimeInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onDurationTimeKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentTime: number
  ) => void;
  onDurationTimeBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  increment: number;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);
