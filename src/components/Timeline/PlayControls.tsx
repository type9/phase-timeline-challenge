import React, { useCallback, useEffect } from 'react';
import { DEFAULT_TIMELINE_CONFIG } from './constants';
import { setInputValue } from './utils/inputs';
import { useAnimationFrame } from './hooks/useAnimationFrame';

export type PlayControlsProps = {
  playheadTime: number;
  durationTime: number;
  stateDep: any;
  onCurrentTimeInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onCurrentTimeBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onDurationTimeInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  onDurationTimeBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    currentKeyDown?: React.KeyboardEvent['key']
  ) => void;
  increment: number;
};

/*
 * PlayControls is a mostly dumb component that links state logic to input elements, and handles local behaviour such as selecting, clicking, and blur logic.
 * TO OPTIMIZE: Input elements can be extracted into their own component and the handles can be forwaded by PlayControls.
 *              This would prevent the container and other input elements from having to rerender on state change. Because this is shallow currently, is most likely not important.
 */
export const PlayControls = ({
  playheadTime,
  durationTime,
  stateDep,
  onCurrentTimeInputChange,
  onCurrentTimeBlur,
  onDurationTimeInputChange,
  onDurationTimeBlur,
  increment,
}: PlayControlsProps) => {
  const currentTimeInputRef = React.useRef<HTMLInputElement>(null);
  const durationTimeInputRef = React.useRef<HTMLInputElement>(null);
  const currentKeyDownRef = React.useRef<React.KeyboardEvent['key']>();
  const { scheduleAnimationFrame } = useAnimationFrame();

  //syncs internal state with global state
  useEffect(() => {
    if (currentTimeInputRef.current)
      currentTimeInputRef.current.value = playheadTime.toString();
    if (durationTimeInputRef.current)
      durationTimeInputRef.current.value = durationTime.toString();
  }, [stateDep]);

  const handleInputKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      inputRef: React.RefObject<HTMLInputElement>
    ) => {
      currentKeyDownRef.current = e.key;
      if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget?.blur();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        // if no key was used to make the change, select the input via target, i.e. the input element
        scheduleAnimationFrame(() => inputRef.current?.select()); //animation frame is nessecary to buffer the select of a changing element. alternative is to use setTimeout
    },
    []
  );

  const handleInputKeyUp = useCallback(
    () => (currentKeyDownRef.current = undefined),
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentKeyDownRef.current === undefined)
        // if no key was used to make the change, select the input via target, i.e. the input element
        scheduleAnimationFrame(() => e.target?.select()); //animation frame is nessecary to buffer the select of a changing element. alternative is to use setTimeout
    },
    []
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, valueIfEscaped: string) => {
      //resets input value to state value if Escape is pressed to blur
      if (currentKeyDownRef.current === 'Escape')
        setInputValue(e.currentTarget, valueIfEscaped);
      //importantly resets key detection
      handleInputKeyUp();
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
          onKeyDown={e => handleInputKeyDown(e, currentTimeInputRef)}
          onKeyUp={handleInputKeyUp}
          onChange={e => {
            onCurrentTimeInputChange?.(e, currentKeyDownRef.current);
            handleInputChange(e);
          }}
          onFocus={e => e.currentTarget?.select()}
          onBlur={e => {
            handleInputBlur(e, playheadTime.toString());
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
          min={DEFAULT_TIMELINE_CONFIG.minDuration}
          max={DEFAULT_TIMELINE_CONFIG.maxDuration}
          step={increment}
          onKeyDown={e => handleInputKeyDown(e, durationTimeInputRef)}
          onKeyUp={handleInputKeyUp}
          onChange={e => {
            onDurationTimeInputChange?.(e, currentKeyDownRef.current);
            handleInputChange(e);
          }}
          onFocus={e => e.currentTarget?.select()}
          onBlur={e => {
            handleInputBlur(e, durationTime.toString());
            onDurationTimeBlur?.(e, currentKeyDownRef.current);
          }}
        />
        Duration
      </fieldset>
    </div>
  );
};
