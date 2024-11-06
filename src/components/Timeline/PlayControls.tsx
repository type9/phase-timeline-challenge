import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TIMELINE_CONFIG } from './constants';

export type PlayControlsProps = {
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

export const PlayControls = ({
  playheadTime,
  durationTime,
  onCurrentTimeInputChange,
  onCurrentTimeKeyDown,
  onCurrentTimeBlur,
  onDurationTimeInputChange,
  onDurationTimeKeyDown,
  onDurationTimeBlur,
  increment,
  stateDep,
}: PlayControlsProps) => {
  const currentTimeInputRef = React.useRef<HTMLInputElement>(null);
  const durationTimeInputRef = React.useRef<HTMLInputElement>(null);
  const [time, setTime] = useState<number>(playheadTime);
  const [duration, setDuration] = useState<number>(durationTime);
  const currentKeyDownRef = React.useRef<React.KeyboardEvent['key']>();

  //syncs internal state with global state
  useEffect(() => {
    setTime(playheadTime);
  }, [playheadTime, stateDep]);
  useEffect(() => {
    setDuration(durationTime);
  }, [durationTime, stateDep]);

  const handleInputKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      inputRef: React.RefObject<HTMLInputElement>
    ) => {
      currentKeyDownRef.current = e.key;
      if (e.key === 'Enter' || e.key === 'Escape') inputRef.current?.blur();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        // if an arrow key is used, select the input
        setTimeout(() => {
          //delays selection till after value mutates
          inputRef.current?.select();
        }, 0);
    },
    []
  );

  const handleInputKeyUp = useCallback(() => {
    currentKeyDownRef.current = undefined;
  }, []);

  const selectOnChange = useCallback(
    (inputRef: React.RefObject<HTMLInputElement>) => {
      if (!currentKeyDownRef.current)
        // if no key was used to make the change, select the input
        setTimeout(() => {
          //delays selection till after value mutates
          inputRef.current?.select();
        }, 0);
    },
    []
  );

  return (
    <div
      className="flex items-center justify-between px-2 border-b border-r border-gray-700 border-solid"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <input
          ref={currentTimeInputRef}
          className="px-1 bg-gray-700 rounded"
          type="number"
          data-testid="current-time-input"
          min={0}
          max={durationTime}
          onKeyDown={e => {
            onCurrentTimeKeyDown?.(e, time);
            handleInputKeyDown(e, currentTimeInputRef);
          }}
          onKeyUp={handleInputKeyUp}
          value={time.toString()}
          onChange={e => {
            onCurrentTimeInputChange?.(e, currentKeyDownRef.current);
            setTime(Number(e.target.value));
            selectOnChange(currentTimeInputRef);
          }}
          onFocus={() => currentTimeInputRef.current?.select()}
          onBlur={e => {
            //resets internal state to playhead time if Escape is pressed
            if (currentKeyDownRef.current === 'Escape') setTime(playheadTime);

            onCurrentTimeBlur?.(e, currentKeyDownRef.current);
          }}
          step={increment}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          ref={durationTimeInputRef}
          className="px-1 bg-gray-700 rounded"
          type="number"
          data-testid="duration-input"
          value={duration.toString()}
          min={DEFAULT_TIMELINE_CONFIG.minDuration}
          max={DEFAULT_TIMELINE_CONFIG.maxDuration}
          step={increment}
          onKeyDown={e => {
            onDurationTimeKeyDown?.(e, duration);
            handleInputKeyDown(e, durationTimeInputRef);
          }}
          onKeyUp={handleInputKeyUp}
          onChange={e => {
            onDurationTimeInputChange?.(e, currentKeyDownRef.current);
            setDuration(Number(e.target.value));
            selectOnChange(durationTimeInputRef);
          }}
          onFocus={() => durationTimeInputRef.current?.select()}
          onBlur={e => {
            //resets internal state to playhead time if Escape is pressed
            if (currentKeyDownRef.current === 'Escape')
              setDuration(durationTime);

            onDurationTimeBlur?.(e, currentKeyDownRef.current);
          }}
        />
        Duration
      </fieldset>
    </div>
  );
};
