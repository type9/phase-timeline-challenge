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
  rulerLeft,
  containerScrollLeft,
  minTime,
  maxTime,
  timeToPixelRatio = 1,
}: {
  currentTime: number;
  rulerLeft: number;
  containerScrollLeft: number;
  minTime: number;
  maxTime: number;
  timeToPixelRatio?: number;
}) => {
  const clampedTime = Math.max(minTime, Math.min(currentTime, maxTime));
  const playheadPositionInUnits = clampedTime * timeToPixelRatio;
  const adjustedPosition =
    playheadPositionInUnits + rulerLeft - containerScrollLeft;

  return adjustedPosition;
};

export const getPlayheadAttributes = ({
  currentTime,
  minTime = 0,
  maxTime,
  rulerRef,
  rulerContainerRef,
}: {
  currentTime: number;
  maxTime: number;
  minTime?: number;
  rulerRef: React.RefObject<HTMLDivElement>;
  rulerContainerRef: React.RefObject<HTMLDivElement>;
}): { hidden: boolean; left: string } | undefined => {
  const rulerLeft = rulerRef?.current?.offsetLeft;
  const containerLeft = rulerContainerRef?.current?.offsetLeft;
  const containerRight =
    rulerContainerRef?.current?.getBoundingClientRect().right;
  const containerScrollLeft = rulerContainerRef?.current?.scrollLeft;

  if (
    rulerLeft === undefined ||
    containerLeft === undefined ||
    containerScrollLeft === undefined ||
    containerRight === undefined
  )
    return;

  const calculatedPosition = calculatePlayheadPosition({
    currentTime,
    rulerLeft,
    containerScrollLeft,
    minTime,
    maxTime,
  });

  return {
    hidden: !(
      calculatedPosition >= containerLeft &&
      calculatedPosition <= containerRight
    ),
    left: `${calculatedPosition}px`,
  };
};
