import React from 'react';
import { NumberInput, NumberInputProps } from './NumberInput';

// Main PlayControls component
export const PlayControls = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      className="flex items-center justify-between px-2 border-b border-r border-gray-700 border-solid"
      data-testid="play-controls"
    >
      {children}
    </div>
  );
};

PlayControls.CurrentTimeInput = (props: NumberInputProps) => (
  <fieldset className="flex gap-1">
    Current
    <NumberInput
      className="px-1 bg-gray-700 rounded"
      type="number"
      {...props}
    />
  </fieldset>
);

PlayControls.DurationTimeInput = (props: NumberInputProps) => (
  <fieldset className="flex gap-1">
    <NumberInput
      className="px-1 bg-gray-700 rounded"
      type="number"
      {...props}
    />
    Duration
  </fieldset>
);
