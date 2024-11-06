export const getRelativePositionLeftMouseEvent = (
  e: MouseEvent | React.MouseEvent<HTMLDivElement>,
  ref: React.RefObject<HTMLDivElement>
) => {
  if (!ref.current) return;
  const rect = ref.current.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const timelineWidth = rect.width;

  const clampedX = Math.max(0, Math.min(clickX, timelineWidth));

  return clampedX;
};

export const calculatePlayheadPosition = ({
  currentTime,
  leftOffset,
  leftPadding,
  timeToPixelRatio = 1,
}: {
  currentTime: number;
  leftOffset: number;
  leftPadding: number;
  timeToPixelRatio?: number;
}) => {
  const playheadPositionInPixels = currentTime * timeToPixelRatio;

  const positionWithPadding = playheadPositionInPixels + leftPadding;
  const offsetAdjustedPosition = positionWithPadding - leftOffset;

  return offsetAdjustedPosition;
};
