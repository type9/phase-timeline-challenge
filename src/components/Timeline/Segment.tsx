type SegmentProps = {
  width: string;
};

export const Segment = ({ width }: SegmentProps) => {
  // TODO: resize based on time

  return (
    <div className={'py-2'} style={{ width }} data-testid="segment">
      <div className={`h-6 rounded-md bg-white/10`} />
    </div>
  );
};
