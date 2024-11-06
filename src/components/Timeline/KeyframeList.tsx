import { Segment } from './Segment';

export type KeyframeListProps = {
  segmentWidth: string;
  containerRef: React.RefObject<HTMLDivElement>;
};

const segments = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
  { id: 6, name: '6' },
  { id: 7, name: '7' },
  { id: 8, name: '8' },
  { id: 9, name: '9' },
  { id: 10, name: '10' },
];
export const KeyframeList = ({
  containerRef,
  segmentWidth,
}: KeyframeListProps) => {
  return (
    <div
      ref={containerRef}
      className="px-4 overflow-auto"
      data-testid="keyframe-list"
    >
      {segments.map((_, index) => (
        <Segment key={index} width={segmentWidth} />
      ))}
    </div>
  );
};
