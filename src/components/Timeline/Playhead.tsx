import React, { useImperativeHandle, forwardRef } from 'react';
import { getPlayheadAttributes } from './utils/position'; // Import your utility function

export type PlayheadProps = {
  defaultPositionX?: string;
  defaultVisible?: boolean;
};

export interface PlayheadHandle {
  updatePlayheadPosition: (
    currentTime: number,
    duration: number,
    rulerRef: React.RefObject<HTMLDivElement>,
    rulerContainerRef: React.RefObject<HTMLDivElement>
  ) => void;
}

export const Playhead = forwardRef<PlayheadHandle, PlayheadProps>(
  (props = { defaultPositionX: `0px`, defaultVisible: false }, ref) => {
    const [state, setState] = React.useState({
      hidden: props.defaultVisible,
      positionX: props.defaultPositionX,
    });

    useImperativeHandle(ref, () => ({
      updatePlayheadPosition: (
        currentTime: number,
        duration: number,
        rulerRef: React.RefObject<HTMLDivElement>,
        rulerContainerRef: React.RefObject<HTMLDivElement>
      ) => {
        if (!rulerRef.current || !rulerContainerRef.current) return;

        const playheadStyles = getPlayheadAttributes({
          currentTime,
          maxTime: duration,
          rulerRef,
          rulerContainerRef,
        });

        if (!playheadStyles) return;
        setState({
          positionX: playheadStyles.left,
          hidden: playheadStyles.hidden,
        });
      },
    }));

    return (
      <div
        className="absolute z-10 h-full border-l-2 border-yellow-600 border-solid"
        data-testid="playhead"
        style={{ transform: `translateX(${state.positionX})` }}
        hidden={state.hidden}
      >
        <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
      </div>
    );
  }
);
