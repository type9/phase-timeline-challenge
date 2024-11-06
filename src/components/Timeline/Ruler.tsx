import { useRef, useCallback, useEffect } from 'react';
import { getRelativePositionLeftMouseEvent } from './utils/position';

export type RulerProps = {
  width: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onBarDrag?: (
    e: MouseEvent | React.MouseEvent<HTMLDivElement>,
    relativePositionLeft?: number
  ) => void;
};

export const Ruler = ({ width, onBarDrag, containerRef }: RulerProps) => {
  const localBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // initiates drag
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    e.preventDefault();
  }, []);

  // ends drag
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // when moving mouse over bar
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !onBarDrag) return;
      if (localBarRef.current === null) return;
      onBarDrag(e, getRelativePositionLeftMouseEvent(e, localBarRef));
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
        ref={localBarRef}
        className="h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        data-testid="ruler-bar"
        style={{ width, cursor: 'pointer' }}
      ></div>
    </div>
  );
};
