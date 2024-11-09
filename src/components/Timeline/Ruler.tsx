import { useRef, useCallback, useEffect } from 'react';
import { getRelativePositionLeftMouseEvent } from './utils/position';

export type RulerProps = {
  width: string;
  containerRef: React.RefObject<HTMLDivElement>;
  rulerRef: React.RefObject<HTMLDivElement>;
  onBarClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    relativePositionLeft?: number
  ) => void;
  onBarDrag?: (
    e: MouseEvent | React.MouseEvent<HTMLDivElement>,
    relativePositionLeft?: number
  ) => void;
};

export const Ruler = ({
  width,
  onBarDrag,
  onBarClick,
  containerRef,
  rulerRef,
}: RulerProps) => {
  const isDraggingRef = useRef(false);

  // initiates drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      e.preventDefault();
    },
    [onBarClick]
  );

  // ends drag
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // when moving mouse over bar
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !onBarDrag) return;
      if (rulerRef.current === null) return;
      onBarDrag(e, getRelativePositionLeftMouseEvent(e, rulerRef));
    },
    [onBarDrag]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="min-w-0 px-4 py-2 overflow-x-auto overflow-y-hidden border-b border-gray-700 border-solid"
      data-testid="ruler"
      ref={containerRef}
    >
      <div
        ref={rulerRef}
        className="h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        onClick={e =>
          onBarClick?.(e, getRelativePositionLeftMouseEvent(e, rulerRef))
        }
        data-testid="ruler-bar"
        style={{ width, cursor: 'pointer' }}
      ></div>
    </div>
  );
};
