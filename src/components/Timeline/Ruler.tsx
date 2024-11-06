import { useRef, useCallback } from 'react';
import { getRelativePositionLeftMouseEvent } from './utils/position';

export type RulerProps = {
  width: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onBarClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    relativePositionLeft?: number
  ) => void;
};

export const Ruler = ({ width, onBarClick, containerRef }: RulerProps) => {
  const localBarRef = useRef<HTMLDivElement>(null);

  const handleBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (localBarRef.current === null) return;
      onBarClick?.(e, getRelativePositionLeftMouseEvent(e, localBarRef));
    },
    [onBarClick]
  );

  return (
    <div
      className="min-w-0 px-4 py-2 overflow-x-auto overflow-y-hidden border-b border-gray-700 border-solid"
      data-testid="ruler"
      ref={containerRef}
    >
      <div
        ref={localBarRef}
        className={`h-6 rounded-md bg-white/25`}
        onClick={handleBarClick}
        data-testid="ruler-bar"
        style={{ width }}
      ></div>
    </div>
  );
};
